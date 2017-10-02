<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/2
 * Time: 13:52
 */

namespace Home\Controller;


use Think\Controller;

class TaskController extends Controller
{
    public function _initialize(){
        $this->title="互联网web数据处理";
    }

    public function detail(){
        $id = I("id");
        if(empty($id)){
            $this->error("参数错误");
            return;
        }

        list($t,$l,$o) =D("Task")->getTaskByid($id,10);
        $this->assign("task",$t);
//        $this->assign("level",$l);
//        $this->assign('option',$o);
        $this->display();
    }
}