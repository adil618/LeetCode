function countMajoritySubarrays(nums: number[], target: number): number {
    const n = nums.length;
    let ans = 0;

    for (let i = 0; i < n; i++) {
        const freq = new Map<number, number>();

        for (let j = i; j < n; j++) {
            freq.set(nums[j], (freq.get(nums[j]) || 0) + 1);

            const len = j - i + 1;
            const targetCount = freq.get(target) || 0;

            if (targetCount > Math.floor(len / 2)) {
                ans++;
            }
        }
    }

    return ans;
}