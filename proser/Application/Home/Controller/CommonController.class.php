<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/9/27
 * Time: 19:50
 */

namespace Home\Controller;
use Think\Controller;
use Think\Crypt\Driver\Think;
use Think\Exception;

class CommonController extends Controller
{
    public function upload(){

//        ini_set("upload_max_filesize",'3G');
//        $upload = new \Think\Upload();
//        $upload->rootPath=THINK_PATH;
//        $upload->exts = array('application/octet-stream',"csv");
//        $upload->savePath="../Public/upload/";
//        $upload->autoSub = TRUE;
//        $info=$upload->upload();
//        $path=$info['file']['savepath'].$info['file']['savename'];
        $path=THINK_PATH.'../Public/upload/2017-09-27/59cbbcfbdb858.csv';
        $fp=fopen($path,'r+');
        while($cont=fgetcsv($fp)){
            M("TaskOption")->where("url='$cont[0]'")->save(array('staus'=>0));
        }
//        if($info){
//            $this->ajaxReturn(['code'=>1,'message'=>"上传成功"]);
//        }else{
//            $this->ajaxReturn(['code'=>0,'message'=>$upload->getError()]);
//        }
    }
}