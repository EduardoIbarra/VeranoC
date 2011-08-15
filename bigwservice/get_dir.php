<?php

class MyDirectory {

    public $json = '[';

    public function get_children($dir, $child) {
        $dh = opendir($dir);
        while (($file = readdir($dh)) !== false) {
            if ($file != '.' AND $file != '..' ) {
                if (filetype($dir . $file) == 'dir') {
                    // must be checked if this folder have other subfolder
                    if ($this->count_sub_dir($dir . $file . '/') == 0) {
                        $this->json .= '{text:"'.$file.'", leaf: true, id: "'.$dir . $file.'"},';
                    } else {
                        $this->json .= '{text:"'.$file.'", id: "'.$dir . $file.'", children: [';
                        $this->get_children($dir . $file . '/', true);
                    }
                }
            }
        }
        if ($child) {
            $this->json .=  ']},';
        }
        closedir($dh);
    }

    public function count_sub_dir($dir) {
        $dh = opendir($dir);
        $countdir = 0;
        while (($file = readdir($dh)) !== false) {
            if ($file != '.' AND $file != '..' ) {
                if (filetype($dir . $file) == 'dir') {
                    $countdir++;
                }
            }
        }
        closedir($dh);
        return $countdir;
    }
}

$host_dir = $_SERVER['DOCUMENT_ROOT']."/";

$dir = new MyDirectory();

$dir->get_children($host_dir, false);

$dir->json .= ']';
$dir->json = str_replace(",]", "]", $dir->json);

echo($dir->json);

?>et