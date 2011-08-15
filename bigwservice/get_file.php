<?php

$dir = $_GET['dir'] . "/";

$dh = opendir($dir);
$files = array();
while (($file = readdir($dh)) !== false) {
    if ($file != '.' AND $file != '..' ) {
        if (filetype($dir . $file) == 'file') {
            $files[] = array(
                'filename' => $file,
                'filesize' => filesize($dir . $file). ' bytes',
                'filedate' => date("F d Y H:i:s", filemtime($dir . $file))
            );
        }
    }
}
closedir($dh);

echo(json_encode(array('files' => $files)));

?>