# 关于图表 Y 轴最大最小值问题的思考

这里想讨论下折线图、柱状图的 Y 轴的最大值最小值的问题。

这种图表，它的数据，从数据代表含义的角度，一般可以分为：
- 有最小值，通常为 0，没有最大值，表示纯粹的数据，例如 国家的人口数；
- 有最小值，也有最大值，例如 xx 指数（下文里随便编个国家幸福指数，从定义上决定了该指数最小值为 1，最大值为 10），例如 xx 百分比，最小值 0，最大值 100%；
- 没有最小值，也没有最大值，例如 公司盈利（可正可负）；
- 逻辑上也有 没有最小值，有最大值 的情况，但现实生活中不太常见这种数据；

有了上述分类，于是我们可以从数据代表的含义的固有业务概念上去判断图表 Y 轴应该怎样设计。另外，我们又可以根据真实的数据来辅助判断，例如国家的幸福指数，虽然定义是在 1-10 之间，但加入数据里真实状况是大部分国家都在 3-6 之间，为了让柱状图更好的凸显哪个国家幸福指数更高，我们可以去掉 Y 轴的最大最小值设计，让它根据真实数据动态变化。

现在，假如有国家幸福指数数据（A:3.5,B:3.8,C:5.6,D:4.2,......）。这数据中，最小值 A:3.5，最大值 C:5.6。

**现在出现了一个问题，A 作为最小值，Y 轴的最大最小值又是动态变化的，那是不是柱状图里 A 的柱子的高度为 0 呢？**
A 柱子高度为 0 的话，似乎不太好。这个问题，在这种情景下是可以解决的，取整就是了，最小值向下取整得到 3，最大值向上取整得到 6，于是 A 的柱高就不为 0 了。

**但假如 A 的值恰好是一个整数，例如它就是 3，这种情况下又该怎么办？**
也有解决办法是取比数据的最小值还要小的整数，`get_y_min(3.5) === 3; get_y_min(3) === 2;`。

> 关于这种非 0 最小值问题（固定最小值非0 或 动态最小值），在固定 Y 轴里，也是有可能出现，假如有国家幸福指数恰好为 1，那个国家的柱子高度是不是为 0 ？

**另外，还有问题，在数据值很大的情况下，按 1 取整在实际体验上反而不对。**例如国家人口数，应该按万，百万取整更合适（这其实就是 echarts 图表配置的 interval 的概念了）。

**还有，许多设计喜欢根据 Y 轴数值来决定颜色变化（例如值越大越红，越小越蓝），于是这种设计又跟动态 Y 轴最大最小值在理念上其实有冲突了。**明明数据代表的含义本身业务概念就有最大最小值，而真实数据也是大家数据都不错，理论上都应该显示为蓝色，偏偏非要矮子里拔高个，找出数值更大的几个标为红色，这是否合适呢？这个问题我没想到好的方法。

设计中有时还会出现阶段性变色的情况。例如给的设计图中 Y 轴是 0-100，然后 0-25 蓝色，25-50 浅蓝，50-75 浅红，75-100 红色。然后根据业务概念，根据实际数据，决定设计为动态最大最小值，于是那个阶段性颜色又该怎么变化呢。 

假设有种数据标准 xyz 通常是值 1-5，但出现 6 也是有可能的。所以 xyz 属于有最小值，没有最大值的数据。在程序实现的角度，要想不截断大于 5 的数据（例如 6），就必须按动态最大值去设计。毕竟说 xyz 超 100 很扯，但超 5 可以，超 6 好像也不是不行，超 7...... 这种问题，没人能定档，机器更不行。而阶段性变色，如果颜色与 几档几级 有关，那自然颜色与数值从一开始就有固定绑定。但有的时候颜色与数值没有固定绑定关系，Y 轴又是动态的，那时候颜色能表达的信息就很少了，只能表达趋势或者高低，鉴于趋势、高低本身由折线图柱状图通过点和柱子的高低表达了出来，所以没有绑定数值的颜色本身没有表达任何信息，阶段性变色甚至更是误导。
> **没有绑定数值的阶段性变色是误导**，可以举例：没有绑定数值的阶段性变色，只能是动态 Y 轴，阶段性变色与 Y 轴的百分比绑定，例如 Y 轴下 50% 是蓝色，上 50% 是红色。然后一张图里有一个高个子 6 个低个子，于是那个高个子是红色，其他为蓝色；另有一张图有 6 个低个，1 个超低，于是有 6 个红色，1 个蓝色；这非常容易让人误解为第二张图的数据普遍比第一张图的大。其实从这个概念来说，动态 Y 轴本身也会容易让人误解，所以动态 Y 轴应该强调的是一张图里的变化，固定 Y 轴更适合多张图的对比。

所以总的来说，设计折线图、柱状图的 Y 轴最大最小值，我们需要考虑数据本身代表的业务含义，需要考虑实际数据和产品的目的，还有取整单位，以及设计与产品的搭配考量。

