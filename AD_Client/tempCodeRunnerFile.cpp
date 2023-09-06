#include<iostream>
#include<climits>
#include<string>
using namespace std;
class ABC{
    public:
       int x;
    void ini(){
        this->x=10;
    }
};
int main(){
   ABC *ptr=new ABC();
   ptr->ini();
   cout<<ptr->x;
}