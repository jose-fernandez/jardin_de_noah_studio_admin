import {useContext} from 'react';
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import { ColorModeContext } from "../../contexts";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { mode } = useContext(ColorModeContext);

    return (
        <Link to="/">
            <Box
                sx={{
                    height: "72px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "text.primary",
                }}
            >
                
                {!collapsed
                    ? <img width={195} src={
                        mode === "dark" ? "/images/logo-name-dark.svg?url" : "/images/logo-name-light.svg?url"
                    } /> 
                    : <img width={40} src="/images/logo-icon.svg?url" /> 
                }
            </Box>
        </Link>
    );
};
