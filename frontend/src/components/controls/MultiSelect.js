import React, { useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// import { props.options } from "./utils";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {selectedOp} from "../../services/Redux/actions";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: 300
    },
    indeterminateColor: {
        color: "#f50057"
    },
    selectAllText: {
        fontWeight: 500
    },
    selectedAll: {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)"
        }
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "center"
    },
    variant: "menu"
};

//selected 초기화해야함
export default function MultiSelect(props) {
    // const { name, label, value,error=null, onChange, props.options } = props;

    console.log(props.options)
    const classes = useStyles();
    // const [selected, setSelected] = useState([]);
    const dispatch = useDispatch();

    const selected = useSelector(state=>state.SlidePop.selectedData)
    const isAllSelected =
        props.options.length > 0 && selected.length === props.options.length;

    useEffect(()=>{
        dispatch(selectedOp([]))
    }, [])
    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            dispatch((selectedOp(selected.length === props.options.length ? [] : props.options)));
            return;
        }
        // setSelected(value);
        dispatch(selectedOp(value))
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
            <Select
                labelId="mutiple-select-label"
                multiple
                value={selected}
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
            >
                <MenuItem
                    value="all"
                    classes={{
                        root: isAllSelected ? classes.selectedAll : ""
                    }}
                >
                    <ListItemIcon>
                        <Checkbox
                            classes={{ indeterminate: classes.indeterminateColor }}
                            checked={isAllSelected}
                            indeterminate={
                                selected.length > 0 && selected.length < props.options.length
                            }
                        />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: classes.selectAllText }}
                        primary="Select All"
                    />
                </MenuItem>
                {props.options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <ListItemIcon>
                            <Checkbox checked={selected.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

