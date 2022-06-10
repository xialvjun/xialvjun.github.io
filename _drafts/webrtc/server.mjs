// https://www.cxyzjd.com/article/weixin_34847426/117830475

import fs from 'fs';
import http from 'http';
import EventEmitter from 'events';

// 我在想多方聊天应该怎么做。暂时限制 webrtc 采用 mesh 方案（https://blog.51cto.com/u_15284125/2987476）。
// 首先服务端要维持房间，每个房间有个用户列表，每个用户都有在线状态（需要客户端心跳）。
// 然后，如果是那种不限制人数的聊天，来一个就聊一个，那么：第一个用户来了，获取用户列表，除了自己没别人，于是除了发心跳，什么都不做；第二个用户来了，获取用户列表，发现除了自己还有一个人，于是生成 RTCPeerConnection, 把自己的信令发给服务端，让服务端转发给第一个人。
// 于是这一步我就觉得很奇怪，你说发给第一个人就要发给第一个人啊，万一你不是这个房间里的人呢？所以我们还要检测这个人是不是房间里的人。于是这个逻辑我就觉得太过奇怪，服务器要做的事情变得很杂，职责不清晰，而且服务器做一遍，客户端还要做一遍。另外，用户在线状态可能是在线的，但万一与其他用户间的 RTCPeerConnection 没有连接成功怎么办，那还算在线吗？
// 那如果服务器只负责 room 状态的广播，那纯粹由客户端修改 room 状态，还会引发数据竞争错误，还有权限问题。
// 所以应该是 服务器ws连接负责广播 room 状态，rest接口负责更改 room 状态。。。
// * 整个的过程种有 公开状态，私有状态。服务器有公开状态和全部私有状态，客户端有公开状态和个人私有状态。然后服务器要向客户端同步 公开状态和私有状态，客户端向服务器发 reset 请求从而按规则去修改公开状态和自己的私有状态，而且还可以修改别人的私有状态（这其实是发私信）。

const rooms = {};
setInterval(() => {
  const now = Date.now();
  Object.keys(rooms).forEach(room_id => {
    const room = rooms[room_id];
    if (now - room.last_access_at > 120e3) {
      delete rooms[room_id];
      return;
    }
    Object.keys(room.users).forEach(user_id => {
      const user = room.users[user_id];
      if (now - user.last_access_at > 60e3) {
        delete room.users[user_id];
        return;
      }
    });
  });
}, 1e3);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') {
    res.setHeader('Content-Type', 'text/html');
    return fs.createReadStream('./index.html', 'utf8').pipe(res, { end: true });
  }
  if (url.pathname === '/room') {
    // 后进入聊天室的作为发起方，先进入的作为接受方，这样就很方便解决谁是发起方的问题了（这需要 websocket 或者是不停地轮询，哪怕已经开始对讲了）
    // 或者统一由 server 决定谁是发起方（用户轮询 room，server 看 room 满了，就给 room 增加 谁是发起方 的信息）
    const json = JSON.parse(decodeURIComponent(req.url.split('?json=')[1]));
    const { room_id, user_id, data } = json;
    // if (data === 'o') {
    //   return setTimeout(() => res.end('o'), 1e3);
    // }
    const room = rooms[room_id] = rooms[room_id] || { data: {}, users: {}, msgs: [], last_access_at: 0 };
    const user = room.users[user_id] = room.users[user_id] || { data: {}, msgs: [], last_access_at: 0 };
    room.last_access_at = Date.now();
    user.last_access_at = Date.now();

    const users = room.data.users = room.data.users || [];
    if (!users.find(u => u.id === user_id)) {
      users.push(user_id);
    }

    if (data.cmd === 'sync') {
      if (data.type === 'sse') {
        const interval_access = setInterval(() => {
          room.last_access_at = Date.now();
          user.last_access_at = Date.now();
        }, 1e3);
        res.socket.on('close', e => {
          clearInterval(interval_access);
        });
        res.setHeader("Content-Type","text/event-stream");
        res.setHeader("Cache-Control","no-cache");
        res.setHeader("Connection","keep-alive");
        res.write(`data: ${res+''}\n\n`);
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      const room_data = { ...room.data, users: room.data.users.map(user_id => {
        const user = room.users[user_id];
        const is_online = user && user.last_access_at > Date.now() - 2e3;
        return user && { user_id, is_online };
      }) }
      return res.end(JSON.stringify({ room: room.data, user: user.data }));
    }
    
    if (data.cmd === 'offers') {
      data.offers.forEach(user_offer => {
        const { to, offer } = user_offer;
        room.users[to]?.msgs.push({ cmd: 'offer', from: user_id, offer });
      });
    }

    if (data.cmd === 'answer') {
      const { to, answer } = data;
      room.users[to]?.msgs.push({ cmd: 'answer', from: user_id, answer });
    }

    const ee = EventEmitter();

    // const room = rooms[room_id] = rooms[room_id] || {};
    // clearTimeout(room.heartbeat_timeout);
    // room.heartbeat_timeout = setTimeout(() => {
    //   delete rooms[room_id];
    // },  3e3);
    // room.users = room.users || [];
    
    // let user = room.users.find(u => u.id === user_id);
    // if (!user) {
    //   user = {};
    //   room.users.push(user);
    // }
    // clearTimeout(user.heartbeat_timeout);
    // user.heartbeat_timeout = setTimeout(() => {
    //   room.users = room.users.filter(u => u.id !== user_id);
    // }, 3e3);



    // room[user_id] = signal;
    // res.setHeader('Content-Type', 'application/json');
    // return res.end(JSON.stringify(room));
  }
  // if (url.pathname === '/static_room') {
  //   return res.end('');
  // }
  // res.end(req.url);
});

server.listen(5000);
