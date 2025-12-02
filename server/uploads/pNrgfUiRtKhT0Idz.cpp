#include <iostream>
#include <vector>
#include <string>
using namespace std;

void helper(vector<vector<int>>& m, int r, int c, string path, vector<string>& ans) {
    int n = m.size();
    
    // Base cases:
    if (r < 0 || c < 0 || r >= n || c >= n || m[r][c] == 0) {
        return;  // Out of bounds or blocked cell
    }
    
    // If reached the destination, add the path
    if (r == n - 1 && c == n - 1) {
        ans.push_back(path);
        return;
    }

    // Mark current cell as visited
    m[r][c] = 0;  // Mark the cell as blocked (visited)

    // Explore in all 4 possible directions
    helper(m, r - 1, c, path + "u", ans);  // Move Up
    helper(m, r + 1, c, path + "d", ans);  // Move Down
    helper(m, r, c - 1, path + "l", ans);  // Move Left
    helper(m, r, c + 1, path + "r", ans);  // Move Right

    // Backtrack, unmark the cell
    m[r][c] = 1;
}

vector<string> pathfinder(vector<vector<int>>& m) {
    int n = m.size();
    vector<string> ans;
    string path = "";  // Initialize the path string
    helper(m, 0, 0, path, ans);  // Start from the top-left corner
    return ans;
}

int main() {
    // Test case with a valid square grid
    vector<vector<int>> a = {{1, 0, 0, 0}, 
                             {1, 1, 1, 0}, 
                             {0, 1, 0, 0}, 
                             {0, 1, 1, 1}};  // A 4x4 grid

    vector<string> paths = pathfinder(a);

    // Output all the paths found
    if (paths.empty()) {
        cout << "No path found." << endl;
    } else {
        for (const string& path : paths) {
            cout << path << endl;
        }
    }

    return 0;
}
