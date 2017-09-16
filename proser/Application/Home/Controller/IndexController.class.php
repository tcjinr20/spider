<?php
namespace Home\Controller;
use Think\Controller;

class IndexController extends Controller {
    public function index(){
//       $ins = array();
//        for( $i=0;$i<496;$i++){
//            $p['content']= "http://www.alu.cn/aluEnterprise/EnterpriseList_k_c0_p0_cy0_ct0_vip0_ps20_$i.html";
//            $ins[]=$p;
//        }
//
//        M('Task')->addAll($ins);

    }

    public function ajax_form(){
        // 指定允许其他域名访问
        header('Access-Control-Allow-Origin:*');
// 响应类型
        header('Access-Control-Allow-Methods:POST');
// 响应头设置
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        $param = I("param",[]);
        $po =$param['init'];
        $list=$param['list'];
        if(IS_POST && $list){
            D("Task")->backTask($po,$list);
        }

        $task = D("Task")->getNextTask();
        exit(json_encode(array('staus'=>1,'url'=>$task['content'],'nid'=>$task['id'],"script"=>$task['script'])));
    }

    public function pubTask(){
        if(IS_POST){
            $taskname = I("taskname",'');
            if(empty($taskname)){

            }
            $taskid = D('Task')->addTask($taskname);
            $urls = I('urls','');
            $max = I('maxpage');
            $min = I("minpage");
            $options =[];
            for($i=$min;$i<$max;$i++){
                $tl['url']=preg_replace('*',$i,$urls);
                $tl['taskid'] = $taskid;
                $tl['level']=0;
                $options[]=$tl;
            }
            D('Task')->addOptions($options);
            $tasklev=I('task',[]);
            $ls =[];
            foreach($tasklev as $t){
                $int['attrs'] =$t['attrs'];
                $int['scripts'] =$t['scripts'];
                $int['taskid']=$taskid;
                $ls[]=$int;
            }
            D('Task')->addLevels($ls);
        }
        $this->display();
    }
}