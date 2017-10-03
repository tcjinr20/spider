<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends Controller {

    public function _initialize(){
        header('Access-Control-Allow-Origin:*');
        header('Access-Control-Allow-Methods:POST');
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        $this->title="互联网web数据处理";
    }
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
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="user.csv"');
        header('Cache-Control: max-age=0');
        $key = array();
        $page = 0;
        $tta=M("TaskLevel")->where("taskid=$task")->select();
        $level = array_pop($tta)['level'];
        $fp = fopen('php://output', 'w') or die("can't open php://output");
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
                $item[]=$v['url'];
                if($puthead){
                    $key[]='数据来源';
                    fputcsv($fp,$key);
                    $puthead=false;
                }
                fputcsv($fp,$item);
            }
        }
        fclose($fp);
    }

    public function test(){
        $id = I("id",0);
        $this->id=$id;
        $this->display();
    }
}