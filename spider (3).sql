-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 �?09 �?16 �?08:25
-- 服务器版本: 5.5.53
-- PHP 版本: 5.6.27

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `spider`
--

-- --------------------------------------------------------

--
-- 表的结构 `sp_task`
--

CREATE TABLE IF NOT EXISTS `sp_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL COMMENT '任务标识符',
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `sp_task_level`
--

CREATE TABLE IF NOT EXISTS `sp_task_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '等级Id',
  `taskid` int(11) NOT NULL COMMENT '任务id',
  `scripts` int(11) NOT NULL COMMENT '添加的脚本',
  `attrs` int(11) NOT NULL COMMENT '返回数据，关键属性',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `sp_task_option`
--

CREATE TABLE IF NOT EXISTS `sp_task_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) NOT NULL COMMENT '任务id',
  `content` text NOT NULL COMMENT '抓取的内容',
  `level` int(11) NOT NULL COMMENT '任务等级',
  `url` varchar(200) NOT NULL COMMENT '抓取的URL',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
