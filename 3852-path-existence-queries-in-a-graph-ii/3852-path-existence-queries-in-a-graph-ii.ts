function pathExistenceQueries(n: number, nums: number[], maxDiff: number, queries: number[][]): number[] {
    // 1. Sort node indices by value
    const order = Array.from({ length: n }, (_, i) => i);
    order.sort((a, b) => nums[a] - nums[b]);

    const sortedVal = new Int32Array(n);
    const pos = new Int32Array(n); // pos[originalIndex] = sorted position
    for (let i = 0; i < n; i++) {
        sortedVal[i] = nums[order[i]];
        pos[order[i]] = i;
    }

    // 2. Component ids: new component whenever consecutive gap > maxDiff
    const compId = new Int32Array(n);
    for (let i = 1; i < n; i++) {
        compId[i] = compId[i - 1] + (sortedVal[i] - sortedVal[i - 1] > maxDiff ? 1 : 0);
    }

    // 3. Two-pointer: hi[i] = farthest sorted index reachable directly from i
    const hi = new Int32Array(n);
    {
        let right = 0;
        for (let i = 0; i < n; i++) {
            if (right < i) right = i;
            while (right + 1 < n && sortedVal[right + 1] - sortedVal[i] <= maxDiff) {
                right++;
            }
            hi[i] = right;
        }
    }

    // 4. Binary lifting table: jump[k][i] = hi applied 2^k times starting at i
    const LOG = 18; // 2^18 > 1e5
    const jump: Int32Array[] = new Array(LOG);
    jump[0] = hi;
    for (let k = 1; k < LOG; k++) {
        const prev = jump[k - 1];
        const curArr = new Int32Array(n);
        for (let i = 0; i < n; i++) {
            curArr[i] = prev[prev[i]];
        }
        jump[k] = curArr;
    }

    // 5. Answer queries
    const q = queries.length;
    const answer: number[] = new Array(q);

    for (let idx = 0; idx < q; idx++) {
        const u = queries[idx][0];
        const v = queries[idx][1];
        const a0 = pos[u];
        const b0 = pos[v];

        if (a0 === b0) {
            answer[idx] = 0;
            continue;
        }
        if (compId[a0] !== compId[b0]) {
            answer[idx] = -1;
            continue;
        }

        const lo = a0 < b0 ? a0 : b0;
        const target = a0 < b0 ? b0 : a0;

        let cur = lo;
        let steps = 0;
        for (let k = LOG - 1; k >= 0; k--) {
            if (jump[k][cur] < target) {
                cur = jump[k][cur];
                steps += (1 << k);
            }
        }
        // one more hop guaranteed to reach/exceed target (same component)
        answer[idx] = steps + 1;
    }

    return answer;
}