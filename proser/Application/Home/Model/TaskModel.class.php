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
    private function getopt($tid,$level,$staus){
        $w['level']=$level;
        $w['taskid']=$tid;
        $w['staus']=$staus;
        $option = M("TaskOption")->where($w)->order("id")->limit(1)->find();
        return $option;
    }

    private function setOpt($optid,$staus=0){
        $w['id']=$optid;
        $g['staus']=$staus;
        $option = M("TaskOption")->where($w)->save($g);
        return $option;
    }

    public function getNextLevel($tid){
        $level=M('TaskLevel')->where("taskid=$tid and staus=0")->order('level')->limit(1)->find();
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
                        $w['url']=$c->$level['attrs'];
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
            M('TaskLevel')->where("id=".$level['id'])->save(array('staus'=>1));
            $opp = $this->getNextLevel($tid);
            if($opp){
                return $opp;
            }
            return false;
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
        return $this;
    }

    public function addTask($user,$name){
        $d['name']=$name;
        $d['user']=$user;
        return $this->add($d);
    }

    public function addOptions($opt){
        M('TaskOption')->addAll($opt);
    }

    public function addLevels($opl){
        M('TaskLevel')->addAll($opl);
    }

    public function getAllTask($page){
        if($page<=0)$page=1;
        $task = $this->field('id,name,desc')->page($page,30)->select();
        return $task;
    }

    public function getTaskByEdit($id){
        $task=$this->field('id,name,desc')->where("id=$id")->select();
        $level=M("TaskLevel")->field('scripts,attrs,staus,level')->where("taskid=$id")->select();
        $task[0]['level']=$level;
        return $task[0];
    }

    public function getTaskByDetail($taskid){
        $a=$this->find($taskid);
        $b=M("TaskLevel")->field('level,staus')->where("taskid=$taskid")->select();
        foreach($b as &$k){
            $w['level']=$k['level'];
            $w['taskid']=$taskid;
            $arr=M("TaskOption")->field('count(*)')->where($w)->select();
            $k['count']=$arr[0]['count(*)'];
        }
        return [$a,$b];
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