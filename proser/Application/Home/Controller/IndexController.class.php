<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends Controller {
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

    public function ajax_form(){
        header('Access-Control-Allow-Origin:*');
        header('Access-Control-Allow-Methods:POST');
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        $param = I("param",[]);
        $optionid =$param['optionid'];
        $taskid=$param['taskid'];
        $list=$param['list'];
        if(IS_POST && $list){
            D("Task")->backTask($optionid,$list);
            $task = D("Task")->getNextLevel($taskid);
            $task['staus']=1;
            exit(json_encode($task));
        }
    }

    public function ajax_next(){
        $param = I('param',[]);
        $taskid =$param['taskid'];
        if(empty($taskid)){
            exit(json_encode(array('staus'=>0,"message"=>'wrong')));
        }
        $task = D("Task")->getNextLevel($taskid);
        if(empty($task)){
            exit(json_encode(array('staus'=>0,'message'=>"no task")));
        }else{
            $task['staus']=1;
            exit(json_encode($task));
        }
    }

    public function ajax_alltask(){
        $d = D("Task")->getAllTask();
        exit(json_encode($d));
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

    public function putToCvs(){
        $task = I("id",0);
        if(empty($task)){
            exit("参数错误");
        }

        $text = '';
        $key = array();
        $path = C('CVSPATH');
        $page = 0;
        $tta=M("TaskLevel")->where("taskid=$task")->select();
        $level = array_pop($tta)['level'];
        $fp = fopen($path, 'a');
        $puthead = true;

        while($atask = D("Task")->getOutOpt($task,$level,1000,$page)){
            $page++;
            foreach($atask as $k=>$v){
                $ar = json_decode($v['content']);
                $item = [];
                foreach($ar as $bv){
                    foreach($bv as $kl=>$vl){
                        $key[]=$kl;
                        $item[]=iconv("utf-8","utf-8",$vl);
                    }
                }
                if($puthead){
                    fputcsv($fp,$key);
                    $puthead=false;
                }
                fputcsv($fp,$item);
            }
        }
        echo "<a href='$path'>下载</a>";
    }

    public function test(){
        $id = I("id",0);
        $this->id=$id;
        $this->display();
    }
}