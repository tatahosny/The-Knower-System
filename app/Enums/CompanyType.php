<?php
namespace App\Enums;

enum CompanyType: string
{
    case ENTERPRISE = 'enterprise';
    case SMB = 'smb';
    case STARTUP = 'startup';
    case GOVERNMENT = 'government';
    case NON_PROFIT = 'non_profit';
}
