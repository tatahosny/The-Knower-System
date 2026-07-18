<?php

$modules = [
    'Auth' => ['User', 'Role', 'Permission'],
    'CRM' => ['Company', 'Client', 'Lead', 'Quotation', 'Contract'],
    'Projects' => ['Project', 'Milestone', 'Task', 'TaskComment', 'Bug', 'File'],
    'Finance' => ['Invoice', 'Payment', 'Expense'],
    'Hosting' => ['Domain', 'HostingAccount', 'Server', 'SslCertificate'],
    'Support' => ['Ticket', 'TicketMessage'],
    'HR' => ['Employee', 'Attendance', 'Leave'],
    'Notifications' => ['Notification'],
];

function replaceInAllFiles($search, $replace) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('app/'));
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getRealPath());
            $newContent = str_replace($search, $replace, $content);
            if ($content !== $newContent) {
                file_put_contents($file->getRealPath(), $newContent);
            }
        }
    }
    // Also do database/ and routes/
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('database/'));
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getRealPath());
            $newContent = str_replace($search, $replace, $content);
            if ($content !== $newContent) {
                file_put_contents($file->getRealPath(), $newContent);
            }
        }
    }
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('routes/'));
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

foreach ($modules as $module => $models) {
    // Ensure directories exist
    @mkdir("app/Modules/$module/Models", 0777, true);
    @mkdir("app/Modules/$module/Controllers", 0777, true);

    foreach ($models as $model) {
        // Move Model
        $oldModelPath = "app/Models/$model.php";
        $newModelPath = "app/Modules/$module/Models/$model.php";
        
        if (file_exists($oldModelPath)) {
            rename($oldModelPath, $newModelPath);
            replaceInAllFiles("App\Models\\$model", "App\Modules\\$module\Models\\$model");
            // Change namespace in the model file
            $content = file_get_contents($newModelPath);
            $content = str_replace('namespace App\Models;', "namespace App\Modules\\$module\Models;", $content);
            file_put_contents($newModelPath, $content);
        }

        // Move Controller
        $oldControllerPath = "app/Http/Controllers/$module/{$model}Controller.php";
        if (!file_exists($oldControllerPath)) {
            $oldControllerPath = "app/Http/Controllers/{$model}Controller.php"; // Check root too
        }
        $newControllerPath = "app/Modules/$module/Controllers/{$model}Controller.php";

        if (file_exists($oldControllerPath)) {
            rename($oldControllerPath, $newControllerPath);
            replaceInAllFiles("App\Http\Controllers\\$module\\{$model}Controller", "App\Modules\\$module\Controllers\\{$model}Controller");
            replaceInAllFiles("App\Http\Controllers\\{$model}Controller", "App\Modules\\$module\Controllers\\{$model}Controller");
            
            // Change namespace in the controller file
            $content = file_get_contents($newControllerPath);
            $content = str_replace("namespace App\Http\Controllers\\$module;", "namespace App\Modules\\$module\Controllers;", $content);
            $content = str_replace("namespace App\Http\Controllers;", "namespace App\Modules\\$module\Controllers;", $content);
            file_put_contents($newControllerPath, $content);
        }
    }
}

echo "Done mapping.";
