function sumToNumberWithAP(n: number): number {
    return (n * (n + 1)) / 2;
}

function sumToNumberWithIterative(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

function sumToNumberWithArrayReduce(n: number): number {
    return Array.from({length: n}, (_, i) => i + 1).reduce(
        (acc, val) => acc + val,
        0
    );
}
