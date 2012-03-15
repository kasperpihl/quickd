<?php 
  require_once('../config.php'); 
  $registred = false;
  if (!$session->logged_user()) {
    $fb = Shopowner::fb_connect();
    if (isset($fb['success'])&&$fb['success']==='true') $registred = true;
  } else $registred = true;
?>
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!-- Consider adding an manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <!-- Use the .htaccess and remove these lines to avoid edge case issues.
       More info: h5bp.com/b/378 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>QuickD</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
  <meta name="viewport" content="width=750, user-scalable=1">

  <meta property="og:title" content="QuickD" />
  <meta property="og:description" content="En ny måde at handle på - snart i din by."/>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="http://www.quickd.dk" />
  <meta property="og:image" content="<?=ROOT_URL?>img/logo_medium.jpg" />
  <meta property="og:site_name" content="QuickD" />
  <meta property="fb:admins" content="508608046" />

  <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->

  <!-- CSS: implied media=all -->
  <!-- CSS concatenated and minified via ant build script-->
  <link rel="stylesheet" href="css/style.css">
  <!-- end CSS-->

  <!-- More ideas for your <head> here: h5bp.com/d/head-Tips -->

  <!-- All JavaScript at the bottom, except for Modernizr / Respond.
       Modernizr enables HTML5 elements & feature detects; Respond is a polyfill for min/max-width CSS3 Media Queries
       For optimal performance, use a custom Modernizr build: www.modernizr.com/download/ -->
  <script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>

<body>
  <div id="container">
    <div id="top"></div>
    <div id="bgImage"></div>
    <img id="beta" src="img/beta.png">
    <header>

    </header>
    <div id="main" role="main">
      <div id="logo"><img src="img/logo.png"></div>
      <div id="container_left">
        <div id="intro">
          <h1>En ny måde at handle på.</h1>
          <h2>Snart i din by.</h2>
        </div>
        <div id="signup">
          <h1>Skriv dig op</h1>
          <div class="text-area">
            <p id="start_text" style="display:<?=$registred?'none':'block'?>">
              <strong>20. april</strong> åbner vi for en begrænset beta-test i Aarhus. Få en invitation ved at registrere dig med Facebook:
            </p>
            <p id="response_text" style="display:<?=$registred?'block':'none'?>">
              Tak for din registrering!<br />Du vil modtage en invitation til beta-testen  ved lanceringen <strong>den 20. april</strong>.
            </p>
          </div>
          <?php if (!$registred) {   ?>
            <div id="btn_fb_signup"><div class="fb-bg"><span class="fb_btn_text">Registrer med Facebook</span></div></div>
          <?php } ?>
          <div id="btn_fb_like" style="display:<?=$registred?'block':'none'?>">
            <div class="fb-like" data-href="http://www.facebook.com/pages/QuickD/203907689684007" data-send="false" data-layout="button_count" data-width="170" data-show-faces="false"></div>
          </div>


          <a href="#read-more" id="read-more-green" class="scroll"><img src="img/read-more-btn.png"></a>
         <!-- <div id="btn_show_email">Brug e-mail i stedet</div> -->
          <div id="email_signup_area">
            
            <div id="email_fields" style="display:none">
              <input type="text" name="email" id="email" placeholder="E-mail" />
              <div id="btn_email_signup"></div>
            </div>
          </div>
          <div style="clear:both"></div>
        </div>
      </div>
      <div id="read-more-btn"><a href="#read-more" class="scroll"><img src="img/scroll-down.png"></a></div>
    </div>
    <footer>
        <div id="read-more">
         Din by. Lige ved hånden.
          <section id="features">
            <article>
              <section class="left">
                <h1>Opdag fantastiske tilbud omkring dig.</h1>
                <p>
                  Med QuickD går du aldrig glip af et godt tilbud. En brunch på favoritcaféen, en klipning hos din lokale frisør eller en tur i biografen - vi sørger altid for at vise <strong>relevante tilbud omkring dig</strong>, når du har lyst til spændende oplevelser.</p>
              </section>
              <aside class="right"><img src="img/deal-list.png"></aside>
            </article>
            <article>
              <section class="right">
                <h1>Vi sørger for super skarpe deals til dig.</h1>
                <p>
                  På QuickD kan forretningerne selv starte tilbud når de har lyst - direkte fra butikken. <strong>Vi går ikke på kompromis med kvaliteten</strong>. Vi godkender alle tilbud og kræver at de minimum er nedsat med 25% fra originalprisen. 
                </p>
              </section>
              <aside class="left"><img src="img/deal-single.png"></aside>
            </article>
            <article>
              <section class="left">
                <h1>Så nemt er det.</h1>
                <p>
                  Når du har fundet et godt tilbud, er det nemt at gøre brug af det. Alt du skal gøre er at gå ned til butikken og vise dem din telefon med QuickD. Betalingen foregår direkte hos forretningen - <strong>nemt, ik’?</strong>
                </p>
              </section>
              <aside class="right"><img src="img/deal-at-shop.png"></aside>
            </article>
            <div style="clear:both"/>
          </section>
          <div id="scroll-up-btn"><a href="#top" class="scroll"><img src="img/scroll-up.png"></a></div>
          <div id="copyright">Copyright &copy; 2011-2012 QuickD. All rights reserved.</div>
        </div>
    </footer>
  </div> <!--! end of #container -->


  <!-- JavaScript at the bottom for fast page loading -->

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.6.2.min.js"><\/script>')</script>
  <script src="js/libs/jquery_easing.js"></script>


  <!-- scripts concatenated and minified via ant build script-->
  <script defer src="js/plugins.js"></script>
  <script defer src="js/script.js"></script>
  <!-- end scripts-->

	
  <!-- Change UA-XXXXX-X to be your site's ID -->
  <script>
    window._gaq = [['_setAccount','UA-29803533-1'],['_trackPageview'],['_trackPageLoadTime']];
    Modernizr.load({
      load: ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js'
    });
  </script>

  <div id="fb-root"></div>
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you want to support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
    <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
  <![endif]-->
  
</body>
</html>
