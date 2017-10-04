<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends BaseController {

    public function index(){
        $this->tasks=D('Task')->getAllTask();
        $this->display();
    }

    public function delform(){
        $task=I('id',0);
        if(empty($task)){
            exit("<script>alert('参数错误');history.back()</script>");
        }
        D('Task')->deltask($task);
        redirect(U("/"));
    }

    public function exditform(){
        $task=I('id',0);
        list($a,$b,$c)= D('Task')->getTaskByid($task);
        $this->task=$a;
        $this->level=$b;
        $this->option=$c;
        $this->display();
    }





    public function test(){
        $id = I("id",0);
        $this->id=$id;
        $this->display();
    }
}