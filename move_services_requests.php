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

$modules = ['Auth', 'CRM', 'Projects', 'Finance', 'Hosting', 'Support', 'HR', 'Notifications', 'Reports', 'Settings', 'AI'];

foreach ($modules as $module) {
    // MOVE REQUESTS
    $reqDir = "app/Http/Requests/$module";
    if (is_dir($reqDir)) {
        $files = scandir($reqDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                $oldPath = "$reqDir/$file";
                $newPath = "app/Modules/$module/Requests/$file";
                @mkdir(dirname($newPath), 0777, true);
                rename($oldPath, $newPath);
                
                $className = pathinfo($file, PATHINFO_FILENAME);
                replaceInAllFiles("App\Http\Requests\\$module\\$className", "App\Modules\\$module\Requests\\$className");
                
                $content = file_get_contents($newPath);
                $content = str_replace("namespace App\Http\Requests\\$module;", "namespace App\Modules\\$module\Requests;", $content);
                file_put_contents($newPath, $content);
            }
        }
        @rmdir($reqDir);
    }

    // MOVE SERVICES
    $srvDir = "app/Services/$module";
    if (is_dir($srvDir)) {
        $files = scandir($srvDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                $oldPath = "$srvDir/$file";
                $newPath = "app/Modules/$module/Services/$file";
                @mkdir(dirname($newPath), 0777, true);
                rename($oldPath, $newPath);
                
                $className = pathinfo($file, PATHINFO_FILENAME);
                replaceInAllFiles("App\Services\\$module\\$className", "App\Modules\\$module\Services\\$className");
                
                $content = file_get_contents($newPath);
                $content = str_replace("namespace App\Services\\$module;", "namespace App\Modules\\$module\Services;", $content);
                file_put_contents($newPath, $content);
            }
        }
        @rmdir($srvDir);
    }
}
echo "Done mapping requests and services.";
