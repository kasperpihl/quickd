<?php
/*MAY NOT BE DELETED, all passwords depend on this string :D */
define('MD5_STRING','kasperergud');
/* Include the PHP on Couch library */
require_once('libs/couchlib/couch.php');
require_once('libs/couchlib/couchAdmin.php');
require_once('libs/couchlib/couchClient.php');
require_once('libs/couchlib/couchDocument.php');
require_once('libs/couchlib/couchReplicator.php');

/* Include the facebook library */
require_once('libs/facebook/facebook.php');

/* Include functions */
require_once('functions/functions.php');

/* Include classes */
require_once('classes/session.class.php');
require_once('classes/images.class.php');
require_once('classes/myimages.class.php');
?>