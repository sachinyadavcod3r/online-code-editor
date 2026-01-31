#include <bits/stdc++.h>
using namespace std;

class MedianFinder {
private:
    // Max-heap to store the smaller half of the data
    priority_queue<int> maxHeap;

    // Min-heap to store the larger half of the data
    priority_queue<int, vector<int>, greater<int>> minHeap;

public:
    // Constructor to initialize MedianFinder object
    MedianFinder() {
    }

    // Function to add a new number to the data stream
    void addNum(int num) {
        // Step 1: Add to maxHeap first
        maxHeap.push(num);

        // Step 2: Balance by pushing the largest from maxHeap to minHeap
        minHeap.push(maxHeap.top());
        maxHeap.pop();

        // Step 3: If minHeap has more elements, move top back to maxHeap
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }

    // Function to find the current median
    double findMedian() {
        // If both heaps are of equal size, take the average of the tops
        if (maxHeap.size() == minHeap.size()) {
            return (maxHeap.top() + minHeap.top()) / 2.0;
        }

        // If odd size, the top of maxHeap is the median
        return maxHeap.top();
    }
};

// Driver code
int main() {
    MedianFinder mf;
    mf.addNum(1);
    mf.addNum(2);
    cout << mf.findMedian() << endl; // Output: 1.5
    mf.addNum(3);
    cout << mf.findMedian() << endl; // Output: 2
    return 0;
}