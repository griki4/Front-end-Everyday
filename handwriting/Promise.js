const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        }catch (error) {
            this.reject(error)
        }
    }
    //记录Promise对象的状态值
    status = PENDING

    //状态改变时的结果值
    value = null
    reason = null

    onFulfilledCallback = []
    onRejectedCallback = []

    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(value)
            }
        }
    }
    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }
        }
    }

    //then方法根据Promise对象的状态去调用不同的回调函数
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected == 'function' ? onRejected : reason => {throw reason}
        const promise2 =  new MyPromise((resolve, reject) => {
            //封装成功时执行的回调函数
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try{
                        const x = onFulfilled(this.value)
                        //resolvePromise函数用于更改返回的Promise对象的状态
                        resolvePromise(promise2, x, resolve, reject)
                    }catch (error) {
                        reject(error)
                    }
                })
            }
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    }catch (error) {
                        reject(error)
                    }
                })
            }
            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            }else if (this.status === REJECTED) {
                rejectedMicrotask()
            }else if (this.status === PENDING) {
                this.onFulfilledCallback.push(fulfilledMicrotask)
                this.onRejectedCallback.push(rejectedMicrotask)
            }
        })
        return promise2
    }

    //其他的静态类方法
    static resolve(param) {
        if (param instanceof MyPromise) {
            return param
        }
        return new MyPromise(resolve => {
            resolve(param)
        })
    }

    static reject(param) {
        return new MyPromise((resolve, reject) => {
            reject(param)
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        //onFulfilled的执行结果为Promise对象则调用then方法根据该Promise的状态去更改返回的Promise的状态
        // x.then(value => resolve(value), reason => reject(reason))简化之后
        x.then(resolve, reject)
        //假如x是FULFILLED的，那么then方法就会调用resolve方法将promise2的状态修改为FULFILLED
    }else {
        //执行结果为普通值则直接将状态变为FULFILLED
        resolve(x)
    }
}