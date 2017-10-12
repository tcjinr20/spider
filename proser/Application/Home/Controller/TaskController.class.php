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

//    public function filter($act){
//
//        if(!parent::filter($act)){
//            return in_array($act,['']);
//        }else{
//            return true;
//        }
//    }

    public function detail()
    {
        $id = I("id");
        if (empty($id)) {
            $this->error("参数错误");
            return;
        }

        list($t, $l) = D("Task")->getTaskByDetail($id, 10);
        $this->title = $t['name'];
        $this->assign("task", $t);
        $this->assign("level", $l);
        $this->display();
    }

    public function pubTask()
    {
        $this->display();
    }

    public function ajax_pub()
    {
        if (IS_POST) {
            $taskname = I("taskname", '');
            $desc = I('desc', '');
            $urls = I('urls', '');
            $max = I('maxpage');
            $min = I("minpage");
            if (empty($taskname) || empty($urls) || empty($max) || $min > $max) {
                $this->ajaxReturn(['code' => 1004]);
            }
            $taskid = D('Task')->addTask($this->getUserID(), $taskname, $desc);
            $options = [];
            for ($i = $min; $i < $max; $i++) {
                $tl['url'] = preg_replace('/\*/', $i, $urls);
                $tl['taskid'] = $taskid;
                $tl['level'] = 1;
                $options[] = $tl;
            }

            D('Task')->addOptions($options);
            $tasklev = I('task', []);
            if (!empty($tasklev)) {
                $ls = [];
                foreach ($tasklev as $k => $t) {
                    $int['attrs'] = $t['attr'] ? $t['attr'] : '';
                    $int['scripts'] = $t['scripts'] ? $t['scripts'] : "";
                    $int['taskid'] = $taskid;
                    $int['level'] = $t['level'];
                    $ls[] = $int;
                }
                D('Task')->addLevels($ls);
            }
            $this->ajaxReturn(['code' => 1]);
        }
    }

    public function edit()
    {
        $task = I('id');
        if (empty($task)) {
            exit("wrong");
        }
        $this->task = D("Task")->getTaskByEdit($task);
        $this->display();
    }


    public function ajax_entrust()
    {

    }

    public function ajax_mend()
    {
        $act = I('act');
        if ($act == 'task') {
            $w['id'] = I("id");
            $d['name'] = I('name');
            $d['desc'] = I('desc');
            if (M("Task")->where($w)->save($d)) {
                $this->ajaxReturn(['code' => 1]);
            } else {
                $this->ajaxReturn(['code' => 1006]);
            }
        } else if ($act == 'update') {
            $w['taskid'] = I("tasksid");
            $w['level'] = I("level");
            $scripts = [];
            if(I('scripts')){
                foreach(I('scripts') as $g){
                    $u=trim($g['index']);
                    $g['index']=json_decode(html_entity_decode($u));
                    $scripts[]=$g;
                }
            }
            $d['scripts'] = htmlentities(json_encode($scripts));
            $d['attrs'] = I('attrs');
            if (M("TaskLevel")->where($w)->save($d)) {
                $this->ajaxReturn(['code' => 1]);
            } else {
                $this->ajaxReturn(['code' => 1006]);
            }
        } else if ($act == 'add') {
            $d['taskid'] = I("tasksid");
            $d['level'] = I("level");
            $d['scripts'] = json_encode(['type' => 3, 'scripts' => I('scripts')]);
            $d['attrs'] = I('attrs');
            if (M("TaskLevel")->add($d)) {
                $this->ajaxReturn(['code' => 1]);
            } else {
                $this->ajaxReturn(['code' => 1006]);
            }
        }
    }

    public function entrustTask()
    {
        $this->display();
    }
}