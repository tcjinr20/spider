<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends Controller {
    public function index(){

    }

    public function ajax_form(){
        // 指定允许其他域名访问
        header('Access-Control-Allow-Origin:*');
// 响应类型
        header('Access-Control-Allow-Methods:POST');
// 响应头设置
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        $param = I("param",[]);
        $optionid =$param['optionid'];
        $taskid=$param['taskid'];
        $list=$param['list'];
        if(IS_POST && $list){
            D("Task")->backTask($optionid,$list);
            $task = D("Task")->getNextTask($taskid);
            $task['staus']=1;
            exit(json_encode($task));
        }
    }

    public function ajax_next(){
        $param = I('param',[]);
        $taskid = $param['taskid'];
        if(empty($taskid)){
            exit('wrong');
        }
        $task = D("Task")->getNextTask($taskid);
        $task['staus']=1;
        exit(json_encode($task));
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
                        $int['scripts'] =$t['scripts'];
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