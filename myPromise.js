#!/bin/bash

//Обратный вызов - это функция, которая передается в качестве аргумента другой функции, которая будет вызвана этой функцией позже. Часто для обозначения завершения какого-либо действия.
//Promise - это объект JavaScript, представляющий значение, которое будет доступно после завершения асинхронной операции. Обещания могут быть возвращены синхронно, как обычные значения, но значение может быть предоставлено на более позднем этапе.
//В зависимости от результата асинхронной операции обещания могут находиться в трех состояниях:
// PENDING: устанавливается изначально, пока выполняется асинхронная операция;
// FULFILLED: асинхронная операция успешно завершена;
// REJECTED: операция завершилась неудачно.

const FULFILLED = 'fulfilled'
const PENDING = 'pending'
const REJECTED = 'rejected'

class MyPromise {
	constructor(executor) {
		this.state = PENDING
		this.result = undefined
		this.onFulFilledFn = []
		this.onRejectedFn = []
		const resolve = value => {
			if (this.state === PENDING) {
				this.state = FULFILLED
				this.result = value
				this.onFulFilledFn.forEach(fn => fn(value))
			}
		}

		const reject = error => {
			if (this.state === PENDING) {
				this.state = REJECTED
				this.result = error
				this.onRejectedFn.forEach(fn => fn(error))
			}
		}
		try {
			executor(resolve, reject)
		} catch (error) {
			reject(error)
		}
	}
	then(onFulFilled, onRejected) {
		return new MyPromise((resolve, reject) => {
			if (this.state === PENDING) {
				if (onFulFilled) {
					try {
						this.onFulFilledFn.push(() => {
							const newResult = onFulFilled(this.result)
							resolve(newResult)
						})
					} catch (error) {
						resolve(error)
					}
				}
				if (onRejected) {
					this.onRejectedFn.push(() => {
						try {
							this.onRejectedFn.push(() => {
								const newResult = onRejected(this.result)
								reject(newResult)
							})
							if (newResult instanceof MyPromise) {
								newResult.then(resolve, reject)
							} else {
								reject(newResult)
							}
						} catch (error) {
							reject(error)
						}
					})
				}

				return
			}
			if (onFulFilled && this.state === FULFILLED) {
				onFulFilled(() => {
					try {
						this.onFulFilledFn.push(() => {
							const newResult = onFulFilled(this.result)
							if (newResult instanceof MyPromise) {
								newResult.then(resolve, reject)
							} else {
								resolve(newResult)
							}
						})
					} catch (error) {
						reject(error)
					}
				})
			}
			if (onRejected && this.state === REJECTED) {
				onRejected(() => {
					try {
						this.onRejectedFn.push(() => {
							const newResult = onRejected(this.result)
							reject(newResult)
						})
						if (newResult instanceof MyPromise) {
							newResult.then(resolve, reject)
						} else {
							reject(newResult)
						}
					} catch (error) {
						reject(error)
					}
				})
			}
		})
	}
	catch(onRejected) {
		// if (this.state === PENDING) {
		// 	if (onRejected) {
		// 		this.onRejectedFn.push(onRejected)
		// 	}
		// }
		// if (onRejected && this.state === REJECTED) {
		// 	onRejected(this.result)
		// }
		// ИЛИ с меньшим кодом, что правильнее
		this.then(null, onRejected)
	}
}
//1.Написать конструктор promise с принимаемым executor и с состояниями
// const promise = new MyPromise((resolve, reject) => {
// 	reject('error')
// })

// console.log(promise)
//2.Использование с ожиданием
// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve('success')
// 	}, 1500)
// })
// setTimeout(() => {
// 	console.log(promise)
// }, 1600)
// setTimeout(() => console.log(promise), 1600)
//3.reject and resolved должны выполняться только один раз
// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve('success')
// 	}, 500)
// 	setTimeout(() => {
// 		reject('error')
// 	}, 500)
// })

// setTimeout(() => {
// 	console.log(promise)
// }, 500)
//4.Метод then
// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve('success')
// 	}, 1000)
// })
// 	.then(value => {
// 		console.log(value)
// 	})
// 	.catch(error => {
// 		console.log(error)
// 	})
//5.then для перехвата ошибки
//6.Метод catch
// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		reject(new Error('error'))
// 	}, 1000)
// }).catch(error => {
// 	console.log(error)
// })
//7.Использование then сколь угодно раз
//const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve('success')
// 	}, 1000)
// })
// promise.then(value => {
// 	console.log(value)
// })
// promise.then(value => {
// 	console.log(value)
// })
// promise.then(value => {

console.log(value)
// })
// promise.then(value => {
// 	console.log(value)
// })
//8.
// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve('success')
// 	}, 1000)
// })
// 	.then(value => {
// 		return value + 'first'
// 	})
// 	.then(value => {
// 		console.log(value + 'second')
// 	})
// setTimeout(() => {
// 	console.log(promise)
// }, 1000)
