<?php
include 'validator.php';

// Connect to your MySQL database
$servername = "localhost";
$username = "username"; // Change this to your database username
$password = "password"; // Change this to your database password
$database = "your_database"; // Change this to your database name

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Handle HTTP requests
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve JSON data from the database with pagination and sorting
        $page = isset($_GET['page']) ? sanitize($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? sanitize($_GET['limit']) : 10;
        $orderBy = isset($_GET['order_by']) ? sanitize($_GET['order_by']) : 'id';
        $orderDirection = isset($_GET['order_direction']) ? sanitize($_GET['order_direction']) : 'ASC';

        // Validate input data
        if (!validatePage($page) || !validateLimit($limit) || !validateOrderBy($orderBy) || !validateOrderDirection($orderDirection)) {
            echo json_encode(array("error" => "Invalid input data"));
            break;
        }

        $offset = ($page - 1) * $limit;
        $sql = "SELECT * FROM json_data ORDER BY $orderBy $orderDirection LIMIT $limit OFFSET $offset";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array("message" => "No data found"));
        }
        break;
    case 'POST':
        // Store JSON data in the database
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        // Sanitize input data
        $jsonData = $conn->real_escape_string(json_encode($data));
        $sql = "INSERT INTO json_data (data) VALUES ('$jsonData')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Data inserted successfully"));
        } else {
            echo json_encode(array("error" => $conn->error));
        }
        break;
    case 'DELETE':
        // Delete all data from the database
        $sql = "DELETE FROM json_data";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "All data deleted successfully"));
        } else {
            echo json_encode(array("error" => $conn->error));
        }
        break;
    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("error" => "Method Not Allowed"));
        break;
}

// Close database connection
$conn->close();
?>
