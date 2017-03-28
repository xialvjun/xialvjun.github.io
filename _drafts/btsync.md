一个分享文本是

分享仓库id + @ + [ip/domain]

仓库id 是必须， 而 ip/domain 数组是可选的

分享仓库有 version，跟 git 类似，默认是下载整个仓库，并checkout 到最新版。。。也可以选择 checkout 某个版本，并且只下载部分文件。。。提交文件也是 commit


ip/domain 是数组，如果没有，则等待任意响应 该仓库id 的客户端。。。事实上，数组有值也仍然会广播求响应


分享仓库id 也可以是数组，人们可能丢失了修改key。。。。然后有志愿者愿意续起来，则可以在后面加个 id。。。

然后，那些只有前面的 id 的人只能同步前面的部分，他们可以手动加上后面的 id，从而继续同步后面的部分。。。其实后面的id的意思仅仅是指我这个文件夹内包含上一个文件夹的所有内容


当然，这里有个问题是，仓库id 里没法包含文件的 hash 值，毕竟文件是变化的。。。也没法包含 version 的hash值，因为 version 在增长，所以可能会出现下载到病毒的事情。。。

有种方案是，仓库id 就是 version id，就跟 git 的 version hash 一样，然后响应了这个 hash 的 客户端提供完整的 version 列表（这里可能会出现提供假的列表，需要多方对比，而且可能故意有坏人提前提供假的 version。。。所以应该 version 中带有时间，真正的up主能修正）。。。


version 列表的对比可以参考区块链。。。所以 一个 version 里有两个 hash，一个是当前 version 内文件的 hash，一个是前面所有 version 的 hash 的 hash，从而保证前面的文件无法被修改。。。至于后面的文件被修改就不能照顾到了。。。当然，如果都不愿意完整的下载完一个 version，自然啥hash都没用。。。

或者也可以 version 里有三个 hash。。。一个特殊问价 hash，一个 version hash，一个 version hash 的 hash。。。

或者更简单的，整个的只一个 hash  称为 version_n_hash 。。。然后
version_n_hash = hash(version_n-1_hash)
version_n-1_hash = hash(version_n-2_hash)

version_0_hash = hash(hash(file_0)+hash(file_1)+hash(file_2)...)  file_0123 是按文件名排序

具体是使用 hash 加法，还是 hash 的 hash 的 hash，需要再研究。。。

似乎只有 hash 加法才可行，因为要单独获取，而不是获取完整的链。。。当然，这样也大幅降低了破解难度，所以与区块链不同

所以，最开始得到的 hash 应该称为 version_n_delivery_hash...然后
version_n_delivery_hash = hash(version_0_hash + version_1_hash + version_2_hash + ... + version_n_hash)
只要客户端能提供这么个 hash 列表，并且自己把他们加起来再做 hash，发现与自己的相同，那就认定这个 hash 列表是真的。。。这里是 包括 version_n_hash 的

然后 version_n_hash = hash(file_0_hash + file_1_hash + ...)

所以，想下哪个版本，想下哪个文件，都是可以的。。。

然后，hash 方法可以支持多种，随客户端可以更新新的 hash 方法。。。

是否可以  version_0_hash = hash(hash(file_0_hash + file_1_hash) + file_2_hash)..... 这样来增加破解难度。。。。