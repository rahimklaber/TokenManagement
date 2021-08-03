import React from "react";
import {createStyles, Drawer, Link, List, ListItem, ListItemText, makeStyles, Theme} from "@material-ui/core";
import "./SideBar.css"
import {useHistory} from "react-router-dom";
const drawerWidth = 160
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: "beige",
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    }),
);
export function SideBar(){
    const classes = useStyles();
    const history = useHistory()

        return (
           <Drawer
               className={classes.root}
               classes={{
                   paper: classes.drawerPaper
               }}
           variant="permanent"
           anchor="left"
           >
               <List>
                   <ListItem button onClick={(event)=>history.push("/issue")}>
                       <ListItemText  primary={"Issue Asset"}/>
                   </ListItem>

                   <ListItem button onClick={(event)=>history.push("/manage")}>
                       <ListItemText primary={"Manage Assets"}/>
                   </ListItem>

                   <ListItem button onClick={(event)=>history.push("/distribute")} >
                       <ListItemText primary={"Distribute tokens"}/>
                   </ListItem>

                   <ListItem button onClick={(event)=>history.push("/register")}>
                       <ListItemText primary={"Register"}/>
                   </ListItem>
                   <ListItem button onClick={(event)=>history.push("/login")}>
                       <ListItemText primary={"Login"}/>
                   </ListItem>
               </List>

           </Drawer>
        )
}