function getSequence(arr) {
  const previous = arr.slice(); // 用于记录每个位置的前一个位置的索引
  const result = [0]; // 用于记录递增子序列的索引
  let i, j, low, high, mid, current;
  const length = arr.length;
  console.log(previous, arr);
  for (i = 0; i < length; i++) {
    const currentValue = arr[i];
    if (currentValue !== 0) {
      // 如果当前值不为0
      j = result[result.length - 1]; // 获取最后一个递增子序列的索引
      if (arr[j] < currentValue) {
        // 如果最后一个递增子序列的值小于当前值
        previous[i] = j; // 记录当前位置的前一个位置的索引为最后一个递增子序列的索引
        result.push(i); // 将当前位置的索引添加到递增子序列中
        console.log(result);
        continue; // 跳过本次循环
      }
      low = 0; // 二分查找的起始位置
      high = result.length - 1; // 二分查找的结束位置
      while (low < high) {
        mid = (low + high) >> 1; // 二分查找的中间位置
        if (arr[result[mid]] < currentValue) {
          // 如果中间位置的值小于当前值
          low = mid + 1; // 更新起始位置为中间位置+1
        } else {
          high = mid; // 更新结束位置为中间位置
        }
      }
      if (currentValue < arr[result[low]]) {
        // 如果当前值小于递增子序列中找到的位置的值
        if (low > 0) {
          previous[i] = result[low - 1]; // 记录当前位置的前一个位置的索引为递增子序列中找到位置的前一个位置的索引
        }
        result[low] = i; // 更新递增子序列中找到位置的索引为当前位置的索引
      }
    }
  }
  console.log(previous, result);
  current = result.length; // 当前递增子序列的长度
  j = result[current - 1]; // 获取最后一个递增子序列的索引
  while (current-- > 0) {
    // 逆序遍历递增子序列的索引数组
    result[current] = j; // 将最后一个递增子序列的索引赋值给当前位置的索引
    j = previous[j]; // 更新最后一个递增子序列的索引为前一个位置的索引
  }

  return result; // 返回递增子序列的索引数组
}

console.log(getSequence([0, 3, 2, 0]));
