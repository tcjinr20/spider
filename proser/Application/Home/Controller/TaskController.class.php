<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/2
 * Time: 13:52
 */

namespace Home\Controller;


use Think\Controller;

class TaskController extends AdminController
{

    public function filter(){
        $this->__filter[]="detail";
        return $this->__filter;
    }

    public function detail(){
        $id = I("id");
        if(empty($id)){
            $this->error("参数错误");
            return;
        }

        list($t,$l) =D("Task")->getTaskByDetail($id,10);
        $this->title=$t['name'];
        $this->assign("task",$t);
        $this->assign("level",$l);
        $this->display();
    }

    public function pubTask(){
        if(IS_POST){
            $taskname = I("taskname",'');
            $urls = I('urls','');
            $max = I('maxpage');
            $min = I("minpage");
            if(empty($taskname)||empty($urls)||empty($max)||$min>$max){
                $this->ajaxReturn(['code'=>1004]);
            }
            $taskid = D('Task')->addTask($this->getUserID(),$taskname);
            $options =[];
            for($i=$min;$i<$max;$i++){
                $tl['url']=preg_replace('/\*/',$i,$urls);
                $tl['taskid'] = $taskid;
                $tl['level']=1;
                $options[]=$tl;
            }

            D('Task')->addOptions($options);
            $tasklev=I('task',[]);
            if(!empty($tasklev)){
                $ls =[];
                foreach($tasklev as $k=>$t){
                    $int['attrs'] = $t['attr']?$t['attr']:'';
                    $int['scripts'] =$t['scripts']?$t['scripts']:"";
                    $int['taskid']=$taskid;
                    $int['level']=$t['level'];
                    $ls[]=$int;

                }
                D('Task')->addLevels($ls);
            }
            $this->ajaxReturn(['code'=>1]);
        }
        $this->display();
    }

    public function edit(){
        $task = I('id');
        if(empty($task)){
            exit("wrong");
        }
        $this->task=D("Task")->getTaskByEdit($task);
        $this->display();
    }

    public function entrustTask(){
        $this->display();
    }


}