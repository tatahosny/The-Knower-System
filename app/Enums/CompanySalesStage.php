<?php
namespace App\Enums;

enum CompanySalesStage: string
{
    case PROSPECT = 'prospect';
    case QUALIFIED = 'qualified';
    case NEGOTIATION = 'negotiation';
    case CLOSED_WON = 'closed_won';
    case CLOSED_LOST = 'closed_lost';
}
