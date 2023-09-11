const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
  cout<<"Hello world! cpp\\n";
  return 0;
}
`;

stubs.py = `print("Hello world! python")`;

export default stubs;
