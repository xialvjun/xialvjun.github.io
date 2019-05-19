dart 里有 const variable 和 const value。。。const value 不可被修改，而且是编译期创建，且相同内容，只创建一次。。。const variable 是不可被重新指向

const value 需要有 const constructor
class Point { 
  final int x; 
  final int y; 
  Point(this.x, this.y);
}
这里 const Point(0, 0) 会报错。。。
class Point { 
  final int x; 
  final int y; 
  const Point(this.x, this.y);
}
此时，const Point(0, 0) 才不会报错。。。另外 Point(a, b) 也不会报错。。。所以，好像所有的构造函数都应该写成 const constructor**dart sucks**
Point 是一个 type，也是一个函数，可以 new Point(a, b) 也可以 Point(a, b) ... new 好像根本无用**dart sucks**
Point 虽然也是一个函数，但这个函数却不可以作为参数传入其他高阶函数，比如需要(int, int)=> Point的场合**dart sucks**
但是
class Point {
  final int x; 
  final int y; 
  // 这里 const 可要可不要
  const Point(this.x, this.y);
  factory Point.fac(int x, int y) => Point(x, y);
  static Point make_point(int x, int y) => Point(x, y);
}
class Point {
  final int x; 
  final int y; 
  const Point.con(this.x, this.y);
  factory Point(int x, int y) => Point.con(x, y);
  static Point make_point(int x, int y) => Point(x, y);
}
里的 static 函数倒是可以传入其他高阶函数
