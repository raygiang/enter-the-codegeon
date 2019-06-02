<?php
require_once 'partials/header.php';
require_once 'partials/navigation.php';
// if(!isset($_SESSION['userid'])){
//   header('location: index');
// }
?>
<header class="block">
  <h1 class="charcoal">Select Your Challenge!</h1>
</header>
<div class="block">
  <form action="./play" method="POST">
    <?php
    // Iterate through all stage items.
    foreach ($allStages as $stage) {
      ?>
      <button type="submit" name="stageId" value="<?= $stage['_id']; ?>"> <?= $stage['stageName']; ?> </button>
    <?php
  }
  // Once user chooses stage, send the stageId to play.php
  ?>
  </form>
</div>
<?php
require_once 'partials/footer.php';