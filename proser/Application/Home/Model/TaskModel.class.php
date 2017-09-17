<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/9/15 0015
 * Time: 下午 6:10
 */

namespace Home\Model;

use Think\Model;

class TaskModel extends Model
{
    public function getNextTask($tid){

        $level=M('TaskLevel')->where("taskid=$tid and staus=0")->order('id')->find();

        if(empty($level)){
            if(IS_AJAX){
                exit(json_encode(array('staus'=>0,'message'=>"no task")));
            }else{
                return false;
            }
        }
        $w['level']=$level['level'];
        $w['taskid']=$tid;
        $w['staus']=0;
        $option = M("TaskOption")->where($w)->limit(1)->find();
        if(empty($option)){
            M('TaskLevel')->where("id=".$level['id'])->save(array('staus'=>1));
            exit(json_encode(array('staus'=>0,'message'=>"no task")));
        }
        $ret['id']=$option['id'];
        $ret['taskid'] = $tid;
        $ret['url'] = $option['url'];
        $ret['scripts'] = $level['scripts'];
        return $ret;
    }

    public function backTask($optionid,$list){
        $d['content'] = json_encode($list);
        $d['updatetime'] = date("Y-d-m ",time());
        $d['staus'] =1;
        M("TaskOption")->where('id='.$optionid)->save($d);
    }

    public function addTask($name){
        $d['name']=$name;
        return $this->add($d);
    }

    public function addOptions($opt){
        M('TaskOption')->addAll($opt);
    }

    public function addLevels($opl){
        M('TaskLevel')->addAll($opl);
    }

    public function getAllTask(){
        $task = $this->field('id,name')->select();
        foreach($task as &$v){
            $v['level']=M('TaskLevel')->where('taskid='.$v['id'])->field('level')->select();
        }
        return $task;
    }

    public function getTaskByid($taskid){
//        $sql = "select a.*,b.scripts,b.attrs,c.url,c.level from sp_task a,sp_task_level b,sp_task_option c WHERE a.id=$taskid and b.taskid=$taskid and c.taskid=$taskid";
//        $d = $this->query($sql);
        $a=$this->find($taskid);
        $b=M("TaskLevel")->where("taskid=$taskid")->select();
        $c=M("TaskOption")->where("taskid=$taskid")->select();
        return [$a,$b,$c];
    }

    public function deltask($taskid){
        $this->delete($taskid);
        M("TaskLevel")->where("taskid=$taskid")->delete();
        M("TaskOption")->where("taskid=$taskid")->delete();
    }

    public function getAllOpt($task,$limit=100){
        return M("TaskOption")->where("taskid=$task")->limit($limit)->select();
    }
}