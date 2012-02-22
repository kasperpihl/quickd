<?php require_once('../config.php'); 
require_admin();
header('Content-Type: text/html; charset=utf8');
if(!isset($_SESSION['feedbackindex'])) $_SESSION['feedbackindex'] = 0;
if(isset($_POST['action'])){
	if(isset($_POST['jumpover'])){
		$_SESSION['approveindex']++;
		redirect($_SERVER['PHP_SELF']);
	}
	$doc_id = $_POST['doc_id'];
	$message = $_POST['message'];
	$hours = $_POST['hours'];
	$update = array('hours'=>$hours,'message'=>$message);
	try{
		$db->updateDocFullAPI('admin','feedbackResponse',array('doc_id'=>$doc_id,'params'=>array('json'=>json_encode($update))));
		redirect($_SERVER['PHP_SELF']);
	}
	catch(Exception $e){
		print_r($e);
	}
}
else{
	try{
		$res = $db->skip($_SESSION['feedbackindex'])->limit(1)->getView('admin','getFeedback');
		$res = $res->rows;
		if(!empty($res)){
			$doc_id = $res[0]->key;
			$feedbackArray = $res[0]->value;
		}
		else{
			if($_SESSION['feedbackindex'] == 0){
				echo die('<a href="index.php">Tilbage</a>&nbsp;&nbsp;&nbsp;<a href="approve.php">Tjek Godkendelser</a><br/><br/>tillykke du har ikke mere feedback der skal besvares');
			}
			else{
				$_SESSION['feedbackindex'] = 0;
				redirect($_SERVER['PHP_SELF']);
			}
		}
	}
	catch(Exception $e){
		print_r($e);
	}
}

	
?>

<div id="feedback-window">
    <div id="feedback-messages">
    <? foreach($feedbackArray as $index => $feedback){
    	if($feedback->type == 'response') echo '<div class="bubble left green" id="feedback-<?= $index ?>">';
    	else echo '<div class="bubble right white" id="feedback-<?= $index ?>">';
    	echo $feedback->message;
 
    	echo '<small>'.date("j M, G:i",$feedback->timestamp);
    	if($feedback->type == 'response') echo '- QuickD';
    	else echo '- Kunden';
    	echo '</small>';
    	echo '</div>';
    }
    ?>
   	</div>
   
   	<div id="feedback-text">
   		
	   	<form action="<?= $_SERVER['PHP_SELF'] ?>" method="post"/>
	   		<input type="hidden" name="action" value="respond"/>
	   		<input type="hidden" name="doc_id" value="<?= $doc_id ?>"/>
            <textarea id="feedback-textfield" name="message"></textarea>
            <select name="hours">
				<option value="0">0</option>
				<option value="1" selected>1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
			</select>
            <input type="submit" name="respond" value="Besvar"/>
            <input type="submit" name="jumpover" value="Spring over"/>
        </form>
   	</div>
</div>

<style>
/* line 1624, ../sass/screen.scss */
#feedback-window {
  position: relative;
  height: 100%;
  background-color: #DFE5E6;
  border-radius: 5px;
  width:600px;
}
/* line 203, ../sass/screen.scss */
#feedback-window .field {
  margin: 10px auto;
  text-align: center;
}
/* line 209, ../sass/screen.scss */
#feedback-window .field .input-wrapper, #feedback-window .field input {
  -moz-transition: all linear 0.2s, box-shadow ease-out 0.2s;
  -webkit-transition: all linear 0.2s, box-shadow ease-out 0.2s;
  -o-transition: all linear 0.2s, box-shadow ease-out 0.2s;
  transition: all linear 0.2s, box-shadow ease-out 0.2s;
  -moz-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  -o-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  -moz-border-radius: 8px;
  -webkit-border-radius: 8px;
  -o-border-radius: 8px;
  -ms-border-radius: 8px;
  -khtml-border-radius: 8px;
  border-radius: 8px;
  display: inline-block;
  background: white url("i/loader.gif") no-repeat;
  background-position: -30px center;
  border: 1px solid #C7C7C7;
  font-family: "Helvetica";
  font-family: "Helvetica Neue", "Helvetica";
  font-size: 18px;
  width: 350px;
  color: black;
  position: relative;
  margin: 0 auto;
  padding-bottom: 10px;
  padding-left: 16px;
  padding-top: 14px;
  outline: none;
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6);
  -o-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6);
}
/* line 234, ../sass/screen.scss */
#feedback-window .field .input-wrapper {
  padding: 0px;
}
/* line 235, ../sass/screen.scss */
#feedback-window .field input:focus, #feedback-window .field .input-wrapper.focus {
  /*background-color: white;
  border-color: #888;
  color: #222;
  @include box-shadow(inset 0 0 3px rgba(0, 0, 0, 0.4));*/
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6), 0 0 15px white;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6), 0 0 15px white;
  -o-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6), 0 0 15px white;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.6), 0 0 15px white;
  border: 1px solid rgba(123, 232, 84, 0.7);
}
/* line 243, ../sass/screen.scss */
#feedback-window .field input.wrapped, #feedback-window .field input.wrapped:focus {
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  -o-box-shadow: none;
  box-shadow: none;
  background: transparent;
  border: none;
  width: 320px;
  margin: 0px;
  z-index: 2;
  display: block;
}
/* line 252, ../sass/screen.scss */
#feedback-window .field .label.long, #feedback-window .window .content .field .long input.label, .window .content #feedback-window .field .long input.label, #feedback-window .window .content .field .long textarea.label, .window .content #feedback-window .field .long textarea.label {
  margin-bottom: 5px;
  font-family: "Helvetica";
  text-align: left;
}
/* line 253, ../sass/screen.scss */
#feedback-window .field .label.hider {
  position: absolute;
  top: 15px;
  left: 18px;
  z-index: 1;
  font-size: 18px;
  color: #bfbfbf;
  text-shadow: 0 0 1px white;
}
/* line 1634, ../sass/screen.scss */
#feedback-window #feedback-messages {
  position: absolute;
  top: 0px;
  bottom: 110px;
  left: 0px;
  right: 0px;
  -moz-transition-property: bottom;
  -webkit-transition-property: bottom;
  -o-transition-property: bottom;
  transition-property: bottom;
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-out;
  -webkit-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  overflow-y: auto;
  padding: 10px 0px;
}
/* line 1642, ../sass/screen.scss */
#feedback-window #feedback-messages.focused {
  bottom: 90px;
}
/* line 1643, ../sass/screen.scss */
#feedback-window #feedback-messages .sent {
  float: left;
}
/* line 1644, ../sass/screen.scss */
#feedback-window #feedback-messages .response {
  float: right;
}
/* line 1646, ../sass/screen.scss */
#feedback-window #feedback-text {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 100px;
  z-index: 2;
  padding: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #fcfcfc;
  *zoom: 1;
  filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFFCFCFC', endColorstr='#FFC6C6C6');
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZjZmNmYyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2M2YzZjNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==');
  background-size: 100%;
  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fcfcfc), color-stop(100%, #c6c6c6));
  background-image: -webkit-linear-gradient(top, #fcfcfc 0%, #c6c6c6 100%);
  background-image: -moz-linear-gradient(top, #fcfcfc 0%, #c6c6c6 100%);
  background-image: -o-linear-gradient(top, #fcfcfc 0%, #c6c6c6 100%);
  background-image: -ms-linear-gradient(top, #fcfcfc 0%, #c6c6c6 100%);
  background-image: linear-gradient(top, #fcfcfc 0%, #c6c6c6 100%);
  border-top: 1px solid #c4c4c4;
  -moz-transition-property: height;
  -webkit-transition-property: height;
  -o-transition-property: height;
  transition-property: height;
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-out;
  -webkit-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
/* line 1668, ../sass/screen.scss */
#feedback-window #feedback-text.focused {
  height: 80px;
}
/* line 1669, ../sass/screen.scss */
#feedback-window #feedback-text.focused textarea {
  background: white;
}
/* line 1671, ../sass/screen.scss */
#feedback-window #feedback-text form {
  height: 100%;
}
/* line 1672, ../sass/screen.scss */
#feedback-window #feedback-text textarea {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  background: #FFFFFF;
  border-color: #444;
  resize: none;
  width: 400px;
  height: 100%;
  float: left;
  margin: 0px;
}
/* line 1682, ../sass/screen.scss */
#feedback-window #feedback-text #feedback-send-btn {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  width: 10%;
  height: 100%;
  position: relative;
  float: right;
  text-align: center;
  vertical-align: middle;
  padding: 0px;
  line-height: 0px;
  border-radius: 8px;
}
/* line 1692, ../sass/screen.scss */
#feedback-window #feedback-text #feedback-send-btn img {
  height: 15px;
  line-height: 100%;
}
/* line 1695, ../sass/screen.scss */
#feedback-window #feedback-text #feedback-send-btn:after {
  display: block;
  width: 100%;
  height: 100%;
  content: ' ';
  position: absolute;
  background: url("i/enter_arrow.png") no-repeat center center;
  background-size: 18px;
}
/* line 1707, ../sass/screen.scss */
#feedback-window .timeshow {
  padding: 3px;
  font-size: 10px;
  color: grey;
  font-style: italic;
}
/* line 1713, ../sass/screen.scss */
#feedback-window .message {
  width: 85%;
  padding: 4px;
  box-shadow: 0 0 2px black;
}
/* line 1718, ../sass/screen.scss */
#feedback-window .message.response {
  margin-top: 12px;
  margin-right: 15px;
  text-align: right;
  background: rgba(200, 200, 200, 0.6);
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  -o-border-radius: 4px;
  -ms-border-radius: 4px;
  -khtml-border-radius: 4px;
  border-radius: 4px;
  background: white;
  /* Old browsers */
  background: -moz-linear-gradient(top, white 0%, #e0e0e0 100%);
  /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, white), color-stop(100%, #e0e0e0));
  /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, white 0%, #e0e0e0 100%);
  /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, white 0%, #e0e0e0 100%);
  /* Opera 11.10+ */
  background: -ms-linear-gradient(top, white 0%, #e0e0e0 100%);
  /* IE10+ */
  background: linear-gradient(top, #ffffff 0%, #e0e0e0 100%);
  /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#e0e0e0',GradientType=0 );
  /* IE6-9 */
}
/* line 1734, ../sass/screen.scss */
#feedback-window .message.sent {
  margin-top: 12px;
  text-align: left;
  margin-left: 15px;
  background: rgba(0, 200, 0, 0.6);
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  -o-border-radius: 4px;
  -ms-border-radius: 4px;
  -khtml-border-radius: 4px;
  border-radius: 4px;
  background: #d7edaa;
  /* Old browsers */
  background: -moz-linear-gradient(top, #d7edaa 0%, #a5d147 100%);
  /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d7edaa), color-stop(100%, #a5d147));
  /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #d7edaa 0%, #a5d147 100%);
  /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, #d7edaa 0%, #a5d147 100%);
  /* Opera 11.10+ */
  background: -ms-linear-gradient(top, #d7edaa 0%, #a5d147 100%);
  /* IE10+ */
  background: linear-gradient(top, #d7edaa 0%, #a5d147 100%);
  /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d7edaa', endColorstr='#a5d147',GradientType=0 );
  /* IE6-9 */
}
.bubble {
    width:540px;
    min-height:36px;
    -moz-border-radius:15px;
    -webkit-border-radius:15px;
    padding:8px 15px;
    border:1px solid rgba(0,0,0,0.25);
    position:relative;
    z-index:8;
    -moz-box-shadow:inset 0px 0px 2px rgba(0,0,0,0.2),0px 1px 2px rgba(0,0,0,.2);
    -webkit-box-shadow:inset 0px 0px 2px rgba(0,0,0,0.2),0px 1px 2px rgba(0,0,0,.2);
    text-shadow:1px 1px rgba(255,255,255,.3);
}
.bubble:after {
    content:'';
    border-left:1px solid rgba(0,0,0,0.25);
    border-bottom:1px solid rgba(0,0,0,0.25);
    position:absolute;
    height:13px;
    width:13px;
}
.left {
    margin:0 0 10px 20px;
}
.left:after {
    left:-8px;
    bottom:20px;   
    -moz-transform:rotate(45deg);
    -webkit-transform:rotate(45deg);
}
.right {
    margin:0 20px 10px 0;
}
.right:after {
    right:-8px;
    bottom:20px;
    -moz-transform:rotate(225deg);
    -webkit-transform:rotate(225deg);
}
.bubble:before {
    padding:0 10px 0 11px;
    content:'';
    position:absolute;
    z-index:-5;
    left:4px;
    top:1px;
    width:inherit;
    height:14px;
    -moz-border-radius:10px;
    -moz-border-radius-bottomleft:5px;
    -moz-border-radius-bottomright:5px;
    -webkit-border-radius:10px;
    -webkit-border-bottom-left-radius:5px;
    -webkit-border-bottom-right-radius:5px;
    background:-moz-linear-gradient(top, rgba(255, 255, 255, .7), rgba(255, 255, 255, .2));
    background:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,.7)),to(rgba(255,255,255,.2)));
}
.avatar {
    position:absolute;
    width:32px;
    height:32px;
    bottom:12px;
}
.left .avatar {
    left:-50px;
}
.right .avatar {
    right:-50px;
}
.avatar img {
    width:32px;
    height:32px;
    border:none;
}
.bubble small {
    display:block;
    margin:11px 0 0 0;
    font-style:italic;
    color:rgba(0,0,0,.3);
    font-size: 0.8em;
}
.white,
.white:after {
    background:#ddd;
}
.green,
.green:after {
    background:#9ADB5C;
}
.blue,
.blue:after {
    background:#75BAEB;
}
.slate,
.slate:after {
    background:#BECFCD;
}
.orange,
.orange:after {
    background:#fc9e51;
}
.yellow,
.yellow:after {
    background:#fde288;
}
.pink,
.pink:after {
    background:#fb89df;
}
</style>