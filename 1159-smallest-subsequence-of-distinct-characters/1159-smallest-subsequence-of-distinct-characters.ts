function smallestSubsequence(s: string): string {
    const lastIndex: number[] = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        lastIndex[s.charCodeAt(i) - 97] = i;
    }

    const inStack: boolean[] = new Array(26).fill(false);
    const stack: string[] = [];

    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        const code = c.charCodeAt(0) - 97;

        if (inStack[code]) continue;

        while (
            stack.length > 0 &&
            stack[stack.length - 1] > c &&
            lastIndex[stack[stack.length - 1].charCodeAt(0) - 97] > i
        ) {
            const removed = stack.pop()!;
            inStack[removed.charCodeAt(0) - 97] = false;
        }

        stack.push(c);
        inStack[code] = true;
    }

    return stack.join('');
}