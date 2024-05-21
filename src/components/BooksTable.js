import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { fetchBooks } from "../api/openLibrary..js";
import { CSVLink } from "react-csv";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("harry potter");
  const [editIdx, setEditIdx] = useState(-1);
  const [editRow, setEditRow] = useState({});

  useEffect(() => {
    const getBooks = async () => {
      const data = await fetchBooks(searchQuery, page + 1, rowsPerPage); // OpenLibrary pages start from 1
      setBooks(data.docs || []);
    };
    getBooks();
  }, [page, rowsPerPage, searchQuery]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow(books[idx]);
  };

  const handleSave = (idx) => {
    const updatedBooks = [...books];
    updatedBooks[idx] = editRow;
    setBooks(updatedBooks);
    setEditIdx(-1);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditRow({ ...editRow, [name]: value });
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Paper>
      <TextField
        label="Search by Author"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "ratings_average",
                "author_name",
                "title",
                "first_publish_year",
                "subject",
                "author_birth_date",
                "author_top_work",
              ].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleSort(column)}
                  >
                    {column.replace("_", " ")}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.map((book, index) => (
              <TableRow key={index}>
                {editIdx === index ? (
                  <>
                    <TableCell>
                      <TextField
                        name="ratings_average"
                        value={editRow.ratings_average}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="author_name"
                        value={editRow.author_name}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="title"
                        value={editRow.title}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="first_publish_year"
                        value={editRow.first_publish_year}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="subject"
                        value={editRow.subject}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="author_birth_date"
                        value={editRow.author_birth_date}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="author_top_work"
                        value={editRow.author_top_work}
                        onChange={handleEditChange}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleSave(index)}>
                        <SaveIcon />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{book.average_rating || "N/A"}</TableCell>
                    <TableCell>
                      {book.author_name?.join(", ") || "N/A"}
                    </TableCell>
                    <TableCell>{book.title || "N/A"}</TableCell>
                    <TableCell>{book.first_publish_year || "N/A"}</TableCell>
                    <TableCell>{book.subject?.join(", ") || "N/A"}</TableCell>
                    <TableCell>{book.author_birth_date || "N/A"}</TableCell>
                    <TableCell>{book.author_top_work || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={books.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button variant="contained" color="primary">
        <CSVLink
          data={books}
          filename={"books.csv"}
          style={{ textDecoration: "none", color: "white" }}
        >
          Download CSV
        </CSVLink>
      </Button>
    </Paper>
  );
};

export default BooksTable;
