# 认证

有很多种认证信息：
- 用户名 + 密码
- 电子邮箱 + 验证码
- 手机号 + 验证码
- 第三方登录

假如一个系统不需要用户名的话，它的用户系统可以是

```yaml
user:
  emails:
    - email_1
    - email_2
    - ...
  username_passwords:
    - username_1_password
    - username_2_password
    - ...
  qqs:
    - qq_1
    - qq_2
    - ...
  wechats:
    - wechat_1
    - wechat_2
    - ...
```

啥，为什么一个人可以绑定多个 email ，多个用户名密码，绑定多个 QQ 号，多个微信号？

因为所有的这些其实都只是一种认证信息而已啊。。。

假设上面的邮箱、用户名密码、QQ号、微信号都各自只有一个，那也有 4 种认证信息。既然一个 user 可以有 4 种认证信息，那为什么不能有 8 种，12 种呢？

那我们有这么多的认证信息，有什么好处呢？

很多网站要 email，可以用来做重置密码，或者 two step verification。

就是这样的好处。

一个账户，在注册时，初始只有一个认证信息，<font color="red">**随着后续绑定的其他的认证工具越来越多，它所拥有的认证信息也就越来越多，账户就可以设置越来越灵活的管理机制**</font>。

例如，如果用户想的话，只要他绑定了 3 个以上的认证信息，完全可以开启 3 step verification。。。

或者使用账户的普通功能需要两个认证信息，使用一个涉及到安全的功能则需要更多的认证信息。。。

甚至不同种类的认证信息有不同的权重，亦或是不同的认证信息适用于不同的接口（即支付密码）。。。

> 需要注意的是：username_password 中的 username 不算认证信息，它起到的唯一作用仅仅是一个唯一约束用来标识而已。。。如果能够保证整个系统里所有人使用的密码各不相同，那 username 要不要也都无所谓了。

> 当然，理论是这样的，但是实际设计软件系统时倒也不用这么奇葩，一般一种认证信息只需要一个就行了。然后 user 上增加个 auth_times(登录需要的认证数) 和 mut_auth_times(修改认证信息需要的认证数) 字段就够了。
