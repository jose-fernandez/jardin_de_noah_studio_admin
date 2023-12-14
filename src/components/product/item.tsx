import { useState } from "react";
import { useTranslate, BaseKey } from "@refinedev/core";
import { DeleteButton } from "@refinedev/mui";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";

import { IProduct } from "../../interfaces";
import { supabaseClient } from "@/utility";

type PropductItem = {
    updateStock?: (changedValue: number, clickedProduct: IProduct) => void;
    product: IProduct;
    show: (id: BaseKey) => void;
};

export const ProductItem: React.FC<PropductItem> = ({
    product,
    show,
    updateStock,
}) => {
    const t = useTranslate();
    const { id, name, description, images, price, isActive } = product;
    const parsedPrice = parseFloat(price).toFixed(2);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removeMedia = async () => {
        const [{ name }] = images;
        const { data: storageData, error: storageError } = await supabaseClient
            .storage
            .from('products')
            .remove([name])
        // TODO: handle error if delete fails
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "100%",
            }}
        >
            <CardHeader
                subheader={!isActive 
                    ? <Chip 
                        color="warning"
                        size="small"
                        variant="outlined"
                        label={t("products.fields.draft")}
                        />
                    : ''}
                action={
                    <Box component="div">
                        <IconButton
                            aria-describedby={popoverId}
                            onClick={handleClick}
                            sx={{ marginRight: "10px", marginTop: "4px" }}
                            aria-label="settings"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Popover
                            id={popoverId}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <Button
                                onClick={() => {
                                    show(id);
                                    setAnchorEl(null);
                                }}
                                size="small"
                                startIcon={<EditIcon />}
                                sx={{
                                    padding: "5px 10px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                }}
                            >
                                {t("stores.buttons.edit")}
                            </Button>
                            <DeleteButton
                                recordItemId={id}
                                children={t("stores.buttons.remove")}
                                onSuccess={removeMedia}
                                sx={{
                                    padding: "5px 10px",
                                    fontSize: "13px",
                                }}
                            />
                            </div>
                        </Popover>
                    </Box>
                }
                sx={{ padding: 0 }}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: { xs: 60, sm: 84, lg: 108, xl: 144 },
                        height: { xs: 60, sm: 84, lg: 108, xl: 144 },
                        borderRadius: "50%",
                    }}
                    alt={name}
                    image={images[0].url}
                />
            </Box>
            <CardContent
                sx={{
                    paddingX: "36px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}
            >
                <Divider />
                <Tooltip title={name}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "18px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {name}
                    </Typography>
                </Tooltip>
                <Tooltip title={description}>
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            overflowWrap: "break-word",
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                            flex: 1,
                        }}
                    >
                        {description}
                    </Typography>
                </Tooltip>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#999999",
                        my: 1,
                    }}
                >{`#10000${id}`}</Typography>
                <Tooltip title={`${parsedPrice}€`} placement="top">
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: "24px",
                            overflowWrap: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                        }}
                    >{`${parsedPrice}€`}</Typography>
                </Tooltip>
                {updateStock && (
                    <TextField
                        type="number"
                        margin="dense"
                        size="small"
                        value={product.stock || 0}
                        onChange={(e) => {
                            e.preventDefault();
                            updateStock(parseInt(e.target.value, 10), product);
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
};
