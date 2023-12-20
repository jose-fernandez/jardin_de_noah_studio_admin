import React from "react";
import { useState } from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    useTable,
    useNotification,
    useCreate,
    useDelete,
    getDefaultFilter,
    HttpError,
} from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateButton } from "@refinedev/mui";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";

import {
    CategoryFilter,
    ProductItem,
    CreateProduct,
    EditProduct,
} from "../../components";
import { IProduct, Nullable } from "../../interfaces";
import { supabaseClient } from "@/utility";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const [categoriesState, setCategoriesState] = useState<number[]>([]);
    const { mutate: mutateCreateMany } = useCreate();
    const { mutate: mutateDelete } = useDelete();
    const { tableQueryResult, setFilters, setCurrent, setPageSize, filters, pageCount } =
        useTable<IProduct>({
            resource: "products",
            meta: {
                select: "*, categories!inner(*)",
            },
            pagination: {
                pageSize: 9,
                mode: 'server',
            }
        });
    const { open: openNotification } = useNotification();

    const createRelationRows = (productId: number, categoryIds: number[]) => {
        mutateCreateMany({
            resource: "categoriesProducts",
            meta: {
                select: 'id',
            },
            values: categoryIds?.map(categoryId => ({
                categoryId: categoryId, productId,
            })),
            successNotification: false,
        },
        {
            onSuccess: () => {
                openNotification({
                    message:  t("notifications.createSuccess", { resource: 'products' }),
                    description: t("notifications.success", { statusCode: 400 }),
                    type: "success",
                });
            },
            onError: () => {
                mutateDelete({
                    resource: 'products',
                    id: productId,
                    successNotification: false,
                });
                setCategoriesState([]);
                showCreateDrawer();
            }
        })
    }
    let createDrawerFormProps = useModalForm<
        IProduct,
        HttpError,
        Nullable<IProduct>
    >({
        refineCoreProps: {
            action: "create", 
            meta: { select: "id"},
            successNotification: false,
            onMutationSuccess: async ({ data }) => {
                createRelationRows(data.id, categoriesState)
            },
        },
        
    });
    const {
        modal: { show: showCreateDrawer },
    } = createDrawerFormProps;

    const editDrawerFormProps = useModalForm<
        IProduct,
        HttpError,
        Nullable<IProduct>
    >({
        refineCoreProps: { 
            action: "edit",
            meta: { select: "*, categories!inner(*)",},
            successNotification: false,

            onMutationSuccess: async ({data}) => {
                const {data: response, error} = await supabaseClient
                    .from('categoriesProducts')
                    .delete()
                    .match({ productId: data.id })
                    .select()
                if (!error) {
                    mutateCreateMany({
                        resource: "categoriesProducts",
                        meta: {
                            select: 'id',
                        },
                        values: categoriesState?.map(categoryId => ({
                            categoryId: categoryId, productId: data.id,
                        })),
                        successNotification: false,
                        invalidates: ['all'],
                    },
                    {
                        onSuccess: () => {
                            openNotification({
                                message:  t("notifications.editSuccess", { resource: 'products' }),
                                description: t("notifications.success", { statusCode: 400 }),
                                type: "success",
                            });
                        },
                    })
                }
            },
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const products: IProduct[] = tableQueryResult.data?.data || [];
    return (
        <>
            <CreateProduct updateCategories={setCategoriesState} {...createDrawerFormProps} />
            <EditProduct updateCategories={setCategoriesState} {...editDrawerFormProps} />
            <Paper
                sx={{
                    paddingX: { xs: 3, md: 2 },
                    paddingY: { xs: 2, md: 3 },
                    my: 0.5,
                }}
            >
                <Grid container columns={16}>
                    <Grid item xs={16} md={12}>
                        <Stack
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            padding={1}
                            direction="row"
                            gap={2}
                        >
                            <Typography variant="h5">
                                {t("products.products")}
                            </Typography>
                            <Paper
                                component="form"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: 400,
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder={t("stores.productSearch")}
                                    inputProps={{
                                        "aria-label": "product search",
                                    }}
                                    onKeyDownCapture={(e) => {
                                        if (e.code === 'Enter') e.preventDefault()
                                    }}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setFilters([
                                            {
                                                field: "name",
                                                operator: "contains",
                                                value:
                                                    e.target.value !== ""
                                                        ? e.target.value
                                                        : undefined,
                                            },
                                        ]);
                                    }}
                                />
                                <IconButton
                                    sx={{ p: "10px" }}
                                    aria-label="search"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                            <CreateButton
                                onClick={() => showCreateDrawer()}
                                variant="outlined"
                                sx={{ marginBottom: "5px" }}
                            >
                                {t("stores.buttons.addProduct")}
                            </CreateButton>
                        </Stack>
                        <Grid container>
                            {products.length > 0 ? (
                                products.map((product: IProduct) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        key={product.id}
                                        sx={{ padding: "8px" }}
                                    >
                                        <ProductItem
                                            product={product}
                                            show={showEditDrawer}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid
                                    container
                                    justifyContent="center"
                                    padding={3}
                                >
                                    <Typography variant="body2">
                                        {t("products.noProducts")}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Pagination
                            count={pageCount}
                            variant="outlined"
                            color="primary"
                            shape="rounded"
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                paddingY: "20px",
                            }}
                            onChange={(
                                event: React.ChangeEvent<unknown>,
                                page: number,
                            ) => {
                                event.preventDefault();
                                setCurrent(page);
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={0}
                        md={4}
                        sx={{
                            display: {
                                xs: "none",
                                md: "block",
                            },
                        }}
                    >
                        <Stack padding="8px">
                            <Typography variant="subtitle1">
                                {t("stores.tagFilterDescription")}
                            </Typography>
                            <CategoryFilter
                                setFilters={setFilters}
                                filters={filters}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};
