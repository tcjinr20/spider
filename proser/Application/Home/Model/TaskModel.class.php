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
    public function getNextTask(){
        $ff = $this->where([])->order('time')->limit(1)->getField('0,id,content');
        return $ff[0];
    }

    public function backTask($id,$list){
        $id=$id?$id:1;
        $d['stepone'] = json_encode($list);
        $d['steponestatus']=1;
        $d['updateone'] = time();
        $this->where('id='.$id)->save($d);
    }

    public function addTask($name){
        return $this->add('name='.$name);
    }

    public function addOptions(){

    }

    public function addLevels(){

    }
}