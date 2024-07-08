import React, { useCallback } from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import { Box, Typography, Paper, ThemeProvider, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import styled from "@emotion/styled";
import { themeTable, tableIcons, localization, components } from "erp-hust/lib/StandardTable/MaterialTableUtils";

const Offset = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const useStyles = makeStyles(() => ({
  tableToolbarHighlight: {
    backgroundColor: "transparent",
  },
}));

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        <LastPage />
      </IconButton>
    </Box>
  );
}

const NewStandardTable = (props) => {
  const classes = useStyles();

  const rowStyle = useCallback(
    (rowData) => ({
      backgroundColor: rowData.tableData.checked ? "#e0e0e0" : "#ffffff",
      fontSize: "12px",
      padding: "4px 8px",
    }),
    []
  );

  return (
    <React.Fragment>
      {!props.hideCommandBar && (
        <Box
          sx={{
            width: "100%",
            height: 30,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            borderBottom: "1px solid rgb(224, 224, 224)",
            pl: 1,
            backgroundColor: "#f5f5f5",
            ...(props.sx ? props.sx.commandBar : {}),
          }}
        >
          {props.commandBarComponents}
        </Box>
      )}
      <ThemeProvider theme={themeTable}>
        <MaterialTable
          {...props}
          title={props.title ? <Typography variant="h6">{props.title}</Typography> : <React.Fragment />}
          localization={{
            ...localization,
            toolbar: {
              searchPlaceholder: "Search",
            },
          }}
          icons={tableIcons}
          options={{
            selection: true,
            pageSize: 10,
            headerStyle: {
              backgroundColor: "#f4f4f4",
              color: "#404040",
              fontWeight: 400,
              fontSize: "14px",
              padding: "4px 8px",
            },
            rowStyle,
            ...props.options,
          }}
          onSelectionChange={props.onSelectionChange}
          onRowClick={props.onRowClick}
          components={{
            ...components,
            Container: (props) => <Paper {...props} elevation={3} />,
            Toolbar: (props) => (
              <MaterialTable.Toolbar
                {...props}
                classes={{ highlight: classes.tableToolbarHighlight }}
                searchFieldStyle={{ height: 24, fontSize: "12px" }}
              />
            ),
            Cell: (props) => (
              <MaterialTable.Cell {...props} style={{ padding: "4px 8px", fontSize: "12px" }} />
            ),
            ...props.components,
          }}
          actions={props.actions}
          editable={props.editable}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};

NewStandardTable.propTypes = {
  hideCommandBar: PropTypes.bool,
  classNames: PropTypes.object,
  localization: PropTypes.object,
  options: PropTypes.object,
  onSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  components: PropTypes.object,
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  actions: PropTypes.array,
  data: PropTypes.array,
  commandBarComponents: PropTypes.element,
  editable: PropTypes.object,
};

export { NewStandardTable, Offset, TablePaginationActions };
