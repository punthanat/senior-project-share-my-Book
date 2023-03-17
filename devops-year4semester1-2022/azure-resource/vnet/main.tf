module "vnet" {
  version             = "2.6.0"
  source              = "Azure/vnet/azurerm"
  vnet_name           = "${var.rg_name}-vnet"
  resource_group_name = var.rg_name_real
  address_space       = var.address_space
  subnet_prefixes     = var.subnet_prefixes
  subnet_names        = var.subnet_names

  tags = {}
}

resource "azurerm_public_ip" "pip" {
  name                = "${var.rg_name}-${var.pip_name}"
  resource_group_name = var.rg_name_real
  location            = var.rg_location_real
  allocation_method   = var.allocation_method
  sku                 = var.sku
}
