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
    private function getopt($tid,$level,$staus=0){
        $w['level']=$level;
        $w['taskid']=$tid;
        $w['staus']=$staus;
        $option = M("TaskOption")->where($w)->order("id desc")->limit(1)->find();
        return $option;
    }

    private function setOpt($optid,$staus=0){
        $w['id']=$optid;
        $g['staus']=$staus;
        $option = M("TaskOption")->where($w)->save($g);
        return $option;
    }

    public function getNextLevel($tid){
        $level=M('TaskLevel')->where("taskid=$tid and staus=0")->order('id desc')->limit(1)->find();
        if(empty($level)){
            return false;
        }
        if($level['level']>1){
            $opt = $this->getopt($tid,$level['level']-1,1);
            if(empty($opt)||empty($opt['content'])){

            }else{
                $con = json_decode($opt['content']);
                $put = [];
                foreach($con as $c){
                    if(!empty($level['attrs'])){
                        $w['url']=$c[$level['attrs']];
                    }else{
                        $w['url']=$c;
                    }
                    $w['level'] = $level['level'];
                    $w['staus']=0;
                    $w['taskid'] = $tid;
                    $put[]=$w;
                }
                M("TaskOption")->addAll($put);
                $this->setOpt($opt['id'],2);
            }
        }

        $option = $this->getopt($tid,$level['level'],0);
        if(empty($option)){
            $opp = $this->getNextLevel($tid);
            if($opp)return$opp;
            else{
                M('TaskLevel')->where("id=".$level['id'])->save(array('staus'=>1));
                $opp = $this->getNextLevel($tid);
                if($opp){
                    return $opp;
                }
                return false;
            }
        }
        $ret['id']=$option['id'];
        $ret['taskid'] = $tid;
        $ret['url'] = $option['url'];
        $ret['scripts'] = $level['scripts'];
        return $ret;
    }

    public function backTask($optionid,$list){
        $d['content'] = json_encode($list);
        $d['updatetime'] = date("Y-m-d H:i:s",time());
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

    public function getTaskByid($taskid,$optionlimit=20){
//        $sql = "select a.*,b.scripts,b.attrs,c.url,c.level from sp_task a,sp_task_level b,sp_task_option c WHERE a.id=$taskid and b.taskid=$taskid and c.taskid=$taskid";
//        $d = $this->query($sql);
        $a=$this->find($taskid);
        $b=M("TaskLevel")->where("taskid=$taskid")->select();
        $c=M("TaskOption")->where("taskid=$taskid")->limit($optionlimit)->select();
        return [$a,$b,$c];
    }

    public function deltask($taskid){
        $this->delete($taskid);
        M("TaskLevel")->where("taskid=$taskid")->delete();
        M("TaskOption")->where("taskid=$taskid")->delete();
    }
    //
    public function getOutOpt($task,$level,$limit=100,$page=0){

        return M("TaskOption")->where("taskid=$task and staus=1 and level=$level")->limit($page*$limit,$limit)->select();
    }
}