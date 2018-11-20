# 如何写出一个体验良好的金额输入框

**html:**
1. `<input type="text" />`
2. `<input type="number" />`
  > 相比 1, 仅允许输入 `/[\d\.e]/` 即数字、小数点、字母 `e`, 但并不会限制输错的时候就根本没反应，另外，得到 `value` 也只在它在 `!isNaN(parseFloat(value))` 的时候才有值，而且是字符串值。在 `value` 不是正确的浮点数时， `value === ''`

**react:**
1. 非受控: `<input defaultValue={state.money} onChange={e => setState({ money: e.target.value })}/>`
2. 受控: `<input value={state.money} onChange={e => setState({ money: e.target.value })}/>`

OK, 知道了 NumberInput 与 TextInput 的区别，也知道了 react 的受控非受控组件的概念。那么：

1. 最简陋的 MoneyInput
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：</span>
      <input type="text" value={state.money} onChange={e => setState({ money: parseFloat(e.target.value) || 0 })} />
    </label>
  )}
</State>
```
体验：输入过程中，只要错误一点点，就立即输入框就整个的变成 `"0"`, 体验极差。

2. 换成 NumberInput
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：</span>
      <input type="number" value={state.money} onChange={e => setState({ money: parseFloat(e.target.value) || 0 })} />
    </label>
  )}
</State>
```
体验同 1。

3. 换下 onChange 的逻辑
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：</span>
      <input type="text" value={state.money} onChange={e => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
          setState({ money: value });
        }
      }} />
    </label>
  )}
</State>
```
体验：无法输入小数点，必须 initial 先有个比较一般的值，之后只能单独修改整数部分或小数部分，小数点不能移位。

4. 换成 NumberInput
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：</span>
      <input type="number" value={state.money} onChange={e => {
        if (e.target.value !== '') {
          setState({ money: parseFloat(e.target.value) });
        }
      }} />
    </label>
  )}
</State>
```
体验同 3, 只是开发者代码相对少一点，不需要判断 `isNaN`。

已经瞎尝试了 4 种了，不能瞎尝试下去了，需要自己好好分析下了，从用户体验的角度。

我们到底需要怎样的一个 MoneyInput。

1. 明显的错误输入是完全禁止的，例如: `/[\d\.e]/` 以外的字符;
2. 因为用户的输入过程是 `valid -> unvalid -> valid -> ... -> valid` 这样一个循环，所以正确输入过程中的错误输入是允许的，例如: `""(空字符串)`, `"0."(后续输入小数部分)`, `"12.23.23"(用户可能左右移动光标删除某一个小数点)` 等等;

5. 所以，我们换成非受控组件
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：</span>
      <input type="text" defaultValue={state.money} onChange={e => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
          setState({ money: value });
        }
      }} />
    </label>
  )}
</State>
```
体验：显示与数据不一致，表单提交时非常容易出错。而且用户可以输入 `/[\d\.e]/` 以外的字符。

6. 使用 NumberInput 来禁止明显的错误输入，并在一个地方显示真正的数据
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => (
    <label>
      <span>金额：{state.money}</span>
      <input type="number" defaultValue={state.money} onChange={e => {
        if (e.target.value !== '') {
          setState({ money: parseFloat(e.target.value) });
        }
      }} />
    </label>
  )}
</State>
```
体验：明显的错误输入已经被禁止，普通的错误输入也能继续输入，而且也显示出了当前的真实数据，告知用户即将提交的数据到底是多少，整体体验不错。不过 **显示当前的真实数据** 并不符合常见的界面设计，考虑结合表单校验。

7. 要即时校验表单，需要使用受控组件，于是有两个状态
```jsx
<State initial={{ money: 0 }}>
  {money => (
    <State initial={{ text: money.state.money + '' }}>
      {({ state, setState }) => (
        <>
          <label>
            <span>金额：</span>
            <input type="number" value={state.text} onChange={e => {
              setState({ text: e.target.value });
              if (string_is_money(e.target.value)) {
                money.setState({ money: parseFloat(e.target.value) })
              }
            }} />
            {!string_is_money(state.text) && <span className="error">不是正确的 money 格式</span>}
          </label>
          <button onClick={_ => api(money.state.money)}>提交</button>
        </>
      )}
    </State>
  )}
</State>
```
体验不错，不过状态代码太复杂。事实上，外层状态只在提交的时候才会用到，完全可以简化掉。

8. 去除外层状态，error 和要提交的数据状态由 validate 临时生成。
```jsx
<State initial={{ money: 0 }}>
  {({ state, setState }) => {
    const validation = validate(state);
    return (
      <>
        <label>
          <span>金额：</span>
          <input type="number" value={state.money} onChange={e => setState({ money: e.target.value })} />
          {!!validation.error('money') && <span className="error">{validation.error('money')}</span>}
        </label>
        <button disabled={!validation.valid} onClick={_ => api(validation.validated_data)}>提交</button>
      </>
    )
  }}
</State>
```
体验不错。。。

结论：form 表单设计中，除了非常明显的错误可以被禁止以外，那些输入过程中的错误，就最好不要直接禁止了，尤其不要纠正用户输入过程中的错误导致用户的输入状态丢失。然后结合 `validate` 函数，生成要显示的错误和要提交的数据状态。`validate` 函数要支持字符串校验，即把字符串 `"36.34"` 往浮点数上校验，得到结果是校验成功，并或得要提交的数据 `36.34`。。。
