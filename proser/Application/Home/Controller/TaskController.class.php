<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/2
 * Time: 13:52
 */

namespace Home\Controller;


use Think\Controller;

class TaskController extends BaseController
{
    public function detail(){
        $id = I("id");
        if(empty($id)){
            $this->error("参数错误");
            return;
        }

        list($t,$l,$o) =D("Task")->getTaskByid($id,10);
        $this->assign("task",$t);
        $this->display();
    }

    public function pubTask(){
        if(IS_POST){
            $taskname = I("taskname",'');
            $urls = I('urls','');
            $max = I('maxpage');
            $min = I("minpage");
            if(empty($taskname)||empty($urls)||empty($max)||$min>$max){
                exit("<script>alert('参数错误');history.back()</script>");
                return;
            }
            $taskid = D('Task')->addTask($taskname);
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
                    if(!empty($t['scripts'])){
                        $int['attrs'] = $t['attr']?$t['attr']:'';
                        $int['scripts'] =htmlspecialchars(htmlentities($t['scripts']));
                        $int['taskid']=$taskid;
                        $int['level']=$t['level'];
                        $ls[]=$int;
                    }
                }
                D('Task')->addLevels($ls);
            }
            redirect(U('index/pubTask'));
        }
        $this->display();
    }


}