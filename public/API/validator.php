<?php
function sanitize($input) {
    // Sanitize input data
    return htmlspecialchars(strip_tags(trim($input)));
}

function validatePage($page) {
    // Validate page number
    return filter_var($page, FILTER_VALIDATE_INT) !== false && $page > 0;
}

function validateLimit($limit) {
    // Validate limit value
    return filter_var($limit, FILTER_VALIDATE_INT) !== false && $limit > 0;
}

function validateOrderBy($orderBy) {
    // Validate order by column
    // Add your own validation logic if needed
    return true;
}

function validateOrderDirection($orderDirection) {
    // Validate order direction
    return in_array(strtoupper($orderDirection), ['ASC', 'DESC']);
}
?>
