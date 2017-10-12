<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends BaseController {

    public function index(){
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

    public function ajax_index(){
        $page=I('page',1);
        $all['data']=D("task")->getAllTask($page);
        $all['count']=D("task")->count();
        $all['code']=0;
        $all['msg']='';
        $this->ajaxReturn($all);
    }

    public function test(){
        $id = I("id",0);
        $this->id=$id;
        $this->display();
    }
}