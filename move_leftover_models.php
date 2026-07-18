<?php

function replaceInAllFiles($search, $replace) {
    $dirs = ['app/', 'database/', 'routes/'];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) continue;
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $content = file_get_contents($file->getRealPath());
                $newContent = str_replace($search, $replace, $content);
                if ($content !== $newContent) {
                    file_put_contents($file->getRealPath(), $newContent);
                }
            }
        }
    }
}

// Move Contact
if (file_exists('app/Models/Contact.php')) {
    @mkdir('app/Modules/CRM/Models', 0777, true);
    rename('app/Models/Contact.php', 'app/Modules/CRM/Models/Contact.php');
    replaceInAllFiles('App\Models\Contact', 'App\Modules\CRM\Models\Contact');
    $c = file_get_contents('app/Modules/CRM/Models/Contact.php');
    $c = str_replace('namespace App\Models;', 'namespace App\Modules\CRM\Models;', $c);
    file_put_contents('app/Modules/CRM/Models/Contact.php', $c);
}

// Move Workspace
if (file_exists('app/Models/Workspace.php')) {
    @mkdir('app/Modules/Settings/Models', 0777, true);
    rename('app/Models/Workspace.php', 'app/Modules/Settings/Models/Workspace.php');
    replaceInAllFiles('App\Models\Workspace', 'App\Modules\Settings\Models\Workspace');
    $c = file_get_contents('app/Modules/Settings/Models/Workspace.php');
    $c = str_replace('namespace App\Models;', 'namespace App\Modules\Settings\Models;', $c);
    file_put_contents('app/Modules/Settings/Models/Workspace.php', $c);
}
echo "Leftovers moved.\n";
