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

// Move ProfileController to Auth
if (file_exists('app/Http/Controllers/ProfileController.php')) {
    rename('app/Http/Controllers/ProfileController.php', 'app/Modules/Auth/Controllers/ProfileController.php');
    replaceInAllFiles('App\Http\Controllers\ProfileController', 'App\Modules\Auth\Controllers\ProfileController');
    $c = file_get_contents('app/Modules/Auth/Controllers/ProfileController.php');
    $c = str_replace('namespace App\Http\Controllers;', 'namespace App\Modules\Auth\Controllers;', $c);
    file_put_contents('app/Modules/Auth/Controllers/ProfileController.php', $c);
}

// Move DashboardController to Core
@mkdir('app/Modules/Core/Controllers', 0777, true);
if (file_exists('app/Http/Controllers/DashboardController.php')) {
    rename('app/Http/Controllers/DashboardController.php', 'app/Modules/Core/Controllers/DashboardController.php');
    replaceInAllFiles('App\Http\Controllers\DashboardController', 'App\Modules\Core\Controllers\DashboardController');
    $c = file_get_contents('app/Modules/Core/Controllers/DashboardController.php');
    $c = str_replace('namespace App\Http\Controllers;', 'namespace App\Modules\Core\Controllers;', $c);
    file_put_contents('app/Modules/Core/Controllers/DashboardController.php', $c);
}
echo "Misc controllers moved.\n";
